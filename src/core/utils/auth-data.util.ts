import { orgApi } from '@/core/api/org.api'
import { projectApi } from '@/core/api/project.api'
import { userApi } from '@/core/api/user.api'
import { LUUA_AUTH_INFO_KEY } from '@/core/config/constant'
import { type AuthInfo } from '@/core/models/auth.model'
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@/shared/utils/localstorage.util'

/**
 * Synchronous "logged-in" hint for the router guard.
 *
 * Authentication is actually carried by the httpOnly cookie (unreadable from
 * JS), so we treat the presence of the cached AuthInfo in localStorage as the
 * hint. It is written after a successful login/cascade and removed on logout
 * or on a 401 — so a stale hint self-heals on the next API call.
 */
export function isAuthenticated(): boolean {
  return !!getLocalStorageItem<AuthInfo>(LUUA_AUTH_INFO_KEY)
}

/**
 * 3-API cascade: fetches user profile, resolves org/project IDs, then fetches
 * org and project detail in parallel. Writes resolved IDs to LS before the
 * parallel calls so the interceptor sends the correct headers.
 *
 * Authentication is via the httpOnly cookie (sent automatically), so no token
 * needs to be present in LS — a 401 from /user/profile means "not logged in".
 */
export async function loadAuthData(): Promise<AuthInfo> {
  const stored = getLocalStorageItem<AuthInfo>(LUUA_AUTH_INFO_KEY) ?? {}

  // Step 1: fetch user profile
  const userRes = await userApi.getUser()
  const user = userRes.data

  // Step 2: resolve orgId
  const storedOrgId = stored.currentOrg?.id ?? null
  const hasValidOrg = user.organizations.some(o => o.id === storedOrgId)
  const orgId = hasValidOrg ? storedOrgId! : (user.organizations[0]?.id ?? null)

  // Step 3: resolve projectId
  const orgProjects = user.projects.filter(p => p.org_id === orgId)
  const storedProjectId = stored.currentProject?.id ?? null
  const hasValidProject = orgProjects.some(p => p.id === storedProjectId)
  const projectId = hasValidProject
    ? storedProjectId!
    : (orgProjects[0]?.id ?? null)

  // Step 4: update LS with resolved IDs so interceptor sends correct headers
  setLocalStorageItem<AuthInfo>(LUUA_AUTH_INFO_KEY, {
    ...stored,
    currentOrg: orgId ? ({ id: orgId } as AuthInfo['currentOrg']) : undefined,
    currentProject: projectId
      ? ({ id: projectId } as AuthInfo['currentProject'])
      : undefined,
  })

  // Step 5: parallel fetch of org + project details
  const [orgRes, projectRes] = await Promise.all([
    orgId ? orgApi.getOrgDetails() : Promise.resolve(null),
    projectId ? projectApi.getProjectDetails() : Promise.resolve(null),
  ])

  // Step 6: build and return complete AuthInfo
  const authInfo: AuthInfo = {
    ...stored,
    user,
    currentOrg: orgRes?.data ?? undefined,
    currentProject: projectRes?.data ?? undefined,
  }

  return authInfo
}

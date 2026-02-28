import { orgApi } from '@/core/api/org.api'
import { projectApi } from '@/core/api/project.api'
import { userApi } from '@/core/api/user.api'
import { LUUA_AUTH_INFO_KEY } from '@/core/config/constant'
import { AuthInfo } from '@/core/models/auth.model'
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@/shared/utils/localstorage.util'

/**
 * 3-API cascade: fetches user profile, resolves org/project IDs, then fetches
 * org and project detail in parallel. Writes resolved IDs to LS before the
 * parallel calls so the interceptor sends the correct headers.
 *
 * Assumes access_token is already present in LS under LUUA_AUTH_INFO_KEY.
 */
export async function loadAuthData(): Promise<AuthInfo> {
  const stored = getLocalStorageItem<AuthInfo>(LUUA_AUTH_INFO_KEY)
  if (!stored?.access_token) {
    throw new Error('No access token found')
  }

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

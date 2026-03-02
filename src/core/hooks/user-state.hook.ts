import { useQueryClient } from '@tanstack/react-query'

import { LUUA_AUTH_INFO_KEY, QUERY_KEYS } from '@/core/config/constant'
import { AuthInfo } from '@/core/models/auth.model'
import { OrganizationDetail, ProjectDetail } from '@/core/models/org.model'
import { logout as logoutUtil } from '@/core/utils/common.util'
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@/shared/utils/localstorage.util'

import { useAppSelector } from './global-state.hook'

/**
 * Single entry point for all auth/user/org/project state in the app.
 *
 * Returns null when the user is not logged in.
 * All components, containers, and pages should use this hook
 * instead of accessing Redux selectors directly.
 */
export const useUserState = () => {
  const queryClient = useQueryClient()
  const user = useAppSelector(state => state.authState.user)
  const currentOrg = useAppSelector(state => state.authState.currentOrg)
  const currentProject = useAppSelector(state => state.authState.currentProject)

  if (!user) return null

  const orgProjects = user.projects.filter(p => p.org_id === currentOrg?.id)

  /**
   * Invalidate the cascade query ([QUERY_KEYS.user]) to re-run the full
   * 3-API sequence (user → org → project).
   *
   * Dependent queries are NOT invalidated here — they are invalidated in
   * App.tsx AFTER the cascade completes and setAuthInfo writes correct
   * org/project data to localStorage. This prevents dependent queries
   * from firing with stale/partial headers during the cascade window.
   */
  const invalidateAndResync = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] })
  }

  const changeOrg = (orgId: string) => {
    const newProjectId = user.projects.find(p => p.org_id === orgId)?.id
    const stored = getLocalStorageItem<AuthInfo>(LUUA_AUTH_INFO_KEY)
    setLocalStorageItem<AuthInfo>(LUUA_AUTH_INFO_KEY, {
      ...stored!,
      currentOrg: { id: orgId } as OrganizationDetail,
      currentProject: newProjectId
        ? ({ id: newProjectId } as ProjectDetail)
        : undefined,
    })
    invalidateAndResync()
  }

  const changeProject = (projectId: string) => {
    const stored = getLocalStorageItem<AuthInfo>(LUUA_AUTH_INFO_KEY)
    setLocalStorageItem<AuthInfo>(LUUA_AUTH_INFO_KEY, {
      ...stored!,
      currentProject: { id: projectId } as ProjectDetail,
    })
    invalidateAndResync()
  }

  return {
    // User fields (id, email, name, profile_image, deactivated, organizations, projects)
    ...user,

    // Plan lives on the org, not the user model
    plan: currentOrg?.plan ?? ('Free' as const),

    // Current org / project detail objects
    currentOrg,
    currentProject,

    // Aliases used by existing components
    // Only expose fully-hydrated objects (with name) to prevent
    // crashes during the brief re-sync window after org/project switch
    selectedOrg: currentOrg?.name ? currentOrg : undefined,
    selectedProject: currentProject?.name ? currentProject : undefined,
    selectedOrgId: currentOrg?.id ?? null,
    selectedProjectId: currentProject?.id ?? null,

    // Filtered project list for the current org
    orgProjects,

    // Connected social channels for the current project
    connectedChannels: currentProject?.connected_channels ?? null,

    // Actions
    changeOrg,
    changeProject,
    logout: logoutUtil,
  }
}

import { useMemo } from 'react'

import {
  type OrgRole,
  type Permission,
  type ProjectRole,
  resolvePermissions,
} from '@/core/rbac'

import { useUserState } from './user-state.hook'

/**
 * Reusable hook for permission-based access control.
 *
 * Usage:
 *   const { can, canAll, canAny } = usePermission()
 *   if (can(Permission.ORG_MANAGE_BILLING)) { ... }
 */
export function usePermission() {
  const user = useUserState()

  const orgRole = (user?.currentOrg?.org_role as OrgRole) ?? 'member'
  const projectRole =
    (user?.projects?.find(p => p.id === user?.currentProject?.id)
      ?.project_role as ProjectRole) ?? 'viewer'

  const permissions = useMemo(
    () => resolvePermissions(orgRole, projectRole),
    [orgRole, projectRole]
  )

  const can = (permission: Permission): boolean => permissions.has(permission)

  const canAll = (...perms: Permission[]): boolean =>
    perms.every(p => permissions.has(p))

  const canAny = (...perms: Permission[]): boolean =>
    perms.some(p => permissions.has(p))

  return { can, canAll, canAny, orgRole, projectRole }
}

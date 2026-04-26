import { LucideIcon } from 'lucide-react'
import { ComponentType } from 'react'

import { UserState } from '@/core/models/user.model'
import { Permission } from '@/core/rbac'

export type settingsTabType =
  | 'account'
  | 'pending-invitations'
  | 'socials'
  | 'billing'
  | 'org-general'
  | 'org-members'
  | 'org-invitations'
  | 'project-general'
  | 'project-members'
  | 'audit-logs'

export type settingAsideType = {
  id: settingsTabType
  profile?: boolean
  icon: LucideIcon
  label: string | ((user: UserState | null) => string)
  contentComponent: ComponentType<{ user: UserState }>
  /** When set, the tab is only visible if the user has this permission */
  requiredPermission?: Permission
}

export type settingsGroupType = {
  id: string
  label: string
  items: settingAsideType[]
}

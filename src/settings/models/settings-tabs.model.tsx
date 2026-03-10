import { LucideIcon } from 'lucide-react'
import { ComponentType } from 'react'

import { UserState } from '@/core/models/user.model'

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

export type settingAsideType = {
  id: settingsTabType
  profile?: boolean
  icon: LucideIcon
  label: string | ((user: UserState | null) => string)
  contentComponent: ComponentType<{ user: UserState }>
}

export type settingsGroupType = {
  id: string
  label: string
  items: settingAsideType[]
}

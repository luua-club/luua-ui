import type { LucideIcon } from 'lucide-react'
import {
  Building2,
  CableIcon,
  CircleUser,
  DollarSign,
  FolderOpen,
  Users,
} from 'lucide-react'
import type { ComponentType } from 'react'

import type { UserState } from '@/core/models/user.model'
import SocialsSettings from '@/settings/components/socials-settings'
import Account from '@/settings/containers/accounts'
import BillingAndCredits from '@/settings/containers/billing-and-credits'
import OrgGeneral from '@/settings/containers/org-general'
import OrgMembers from '@/settings/containers/org-members'
import ProjectGeneral from '@/settings/containers/project-general'
import ProjectMembers from '@/settings/containers/project-members'

export type settingsTabType =
  | 'account'
  | 'socials'
  | 'billing'
  | 'org-general'
  | 'org-members'
  | 'project-general'
  | 'project-members'

type settingsMainContentType = ComponentType<{ user: UserState }>

export type settingAsideType = {
  id: settingsTabType
  kind: 'profile' | 'link'
  icon: LucideIcon
  label: string | ((user: UserState | null) => string)
  search: {
    tab: settingsTabType
  }
  contentComponent: settingsMainContentType
}

export type settingsGroupType = {
  id: string
  label: string
  items: Array<settingAsideType>
}

export const DEFAULT_SETTINGS_TAB: settingsTabType = 'account'

export const SETTINGS_GROUPS: Array<settingsGroupType> = [
  {
    id: 'accounts',
    label: 'Account',
    items: [
      {
        id: 'account',
        kind: 'profile',
        icon: CircleUser,
        label: user => user?.name ?? 'Profile',
        search: {
          tab: 'account',
        },
        contentComponent: Account,
      },
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    items: [
      {
        id: 'project-general',
        kind: 'link',
        icon: FolderOpen,
        label: 'General',
        search: {
          tab: 'project-general',
        },
        contentComponent: ProjectGeneral,
      },
      {
        id: 'project-members',
        kind: 'link',
        icon: Users,
        label: 'Members',
        search: {
          tab: 'project-members',
        },
        contentComponent: ProjectMembers,
      },
      {
        id: 'socials',
        kind: 'link',
        icon: CableIcon,
        label: 'Socials',
        search: {
          tab: 'socials',
        },
        contentComponent: SocialsSettings,
      },
    ],
  },
  {
    id: 'organisation',
    label: 'Organisation',
    items: [
      {
        id: 'org-general',
        kind: 'link',
        icon: Building2,
        label: 'General',
        search: {
          tab: 'org-general',
        },
        contentComponent: OrgGeneral,
      },
      {
        id: 'org-members',
        kind: 'link',
        icon: Users,
        label: 'Members',
        search: {
          tab: 'org-members',
        },
        contentComponent: OrgMembers,
      },
      {
        id: 'billing',
        kind: 'link',
        icon: DollarSign,
        label: 'Billing',
        search: {
          tab: 'billing',
        },
        contentComponent: BillingAndCredits,
      },
    ],
  },
]

export function resolveSettingTab(tab: unknown): settingsTabType {
  const tabValue = String(tab ?? '').trim()

  if (
    SETTINGS_GROUPS.some(group =>
      group.items.some(item => item.id === tabValue)
    )
  ) {
    return tabValue as settingsTabType
  }

  return DEFAULT_SETTINGS_TAB
}

export function getSettingsItemByTab(tab: settingsTabType) {
  return (
    SETTINGS_GROUPS.flatMap(group => group.items).find(
      item => item.id === tab
    ) ?? SETTINGS_GROUPS[0].items[0]
  )
}

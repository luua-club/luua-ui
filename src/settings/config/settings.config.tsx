import {
  Building2,
  CableIcon,
  CircleUser,
  DollarSign,
  FolderOpen,
  MailPlus,
  Users,
} from 'lucide-react'

import { Permission } from '@/core/rbac'
import SocialsSettings from '@/settings/components/socials-settings'
import Account from '@/settings/containers/accounts'
import BillingAndCredits from '@/settings/containers/billing-and-credits'
import OrgGeneral from '@/settings/containers/org-general'
import OrgMembers from '@/settings/containers/org-members'
import PendingInvitations from '@/settings/containers/pending-invitations'
import ProjectGeneral from '@/settings/containers/project-general'
import ProjectMembers from '@/settings/containers/project-members'

import {
  settingsGroupType,
  settingsTabType,
} from '../models/settings-tabs.model'

export const DEFAULT_SETTINGS_TAB: settingsTabType = 'account'

export const SETTINGS_GROUPS: settingsGroupType[] = [
  {
    id: 'accounts',
    label: 'Account',
    items: [
      {
        id: 'account',
        profile: true,
        icon: CircleUser,
        label: user => user?.name ?? 'Profile',
        contentComponent: Account,
      },
      {
        id: 'pending-invitations',
        icon: MailPlus,
        label: 'Pending Invitations',
        contentComponent: PendingInvitations,
      },
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    items: [
      {
        id: 'project-general',
        icon: FolderOpen,
        label: 'Overview',
        contentComponent: ProjectGeneral,
      },
      {
        id: 'project-members',
        icon: Users,
        label: 'Team',
        contentComponent: ProjectMembers,
      },
      {
        id: 'socials',
        icon: CableIcon,
        label: 'Socials',
        contentComponent: SocialsSettings,
        requiredPermission: Permission.PROJECT_MANAGE_SOCIAL_OAUTH,
      },
    ],
  },
  {
    id: 'organisation',
    label: 'Organisation',
    items: [
      {
        id: 'org-general',
        icon: Building2,
        label: 'General',
        contentComponent: OrgGeneral,
      },
      {
        id: 'org-members',
        icon: Users,
        label: 'Members',
        contentComponent: OrgMembers,
        requiredPermission: Permission.ORG_MANAGE_MEMBERS,
      },
      {
        id: 'billing',
        icon: DollarSign,
        label: 'Billing',
        contentComponent: BillingAndCredits,
        requiredPermission: Permission.ORG_MANAGE_BILLING,
      },
    ],
  },
]

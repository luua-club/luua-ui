import {
  createLazyRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { Loader } from 'lucide-react'
import { useMemo } from 'react'

import { usePermission } from '@/core/hooks/use-permission'
import { useUserState } from '@/core/hooks/user-state.hook'

import { SETTINGS_GROUPS } from './config/settings.config'
import AllSettingsLayout from './layouts/all-settings-layout'
import { settingsTabType } from './models/settings-tabs.model'
import {
  getSettingsItemByTab,
  resolveSettingTab,
} from './utils/settings.helper'

/**
 * Settings component - Main settings page with tabbed interface
 * Manages account, social platforms, and billing settings
 */
const Settings = () => {
  // --- Hooks ---
  const user = useUserState()
  const { can } = usePermission()
  const location = useLocation()
  const navigate = useNavigate()

  // Filter settings groups based on user permissions and plan entitlements
  const filteredGroups = useMemo(
    () =>
      SETTINGS_GROUPS.map(group => ({
        ...group,
        items: group.items.filter(
          item =>
            (!item.requiredPermission || can(item.requiredPermission)) &&
            (!item.requiredPlanAccess ||
              (user ? item.requiredPlanAccess(user) : false))
        ),
      })).filter(group => group.items.length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user?.currentOrg?.org_role, user?.currentProject?.id, user?.plan]
  )

  const params = new URLSearchParams(location.search)
  const activeTab = resolveSettingTab(params.get('tab') ?? params.get('tabs'))
  const activeItem = getSettingsItemByTab(activeTab)

  // If user doesn't have permission for the active tab, fall back to first available
  const hasAccess = filteredGroups.some(g =>
    g.items.some(i => i.id === activeTab)
  )
  const resolvedTab = hasAccess
    ? activeTab
    : (filteredGroups[0]?.items[0]?.id ?? 'account')
  const resolvedItem = hasAccess
    ? activeItem
    : getSettingsItemByTab(resolvedTab)

  // --- Functions ---
  const handleTabChange = (tab: settingsTabType) => {
    navigate({
      to: '/settings',
      search: { tab },
      replace: true,
    })
  }

  // --- Early Returns ---
  if (!user) {
    return (
      <div className="flex h-50 items-center justify-center">
        <Loader className="size-4 animate-spin" />
      </div>
    )
  }

  return (
    <AllSettingsLayout
      user={user}
      activeTab={resolvedTab}
      onTabChange={handleTabChange}
      groups={filteredGroups}
    >
      <resolvedItem.contentComponent user={user} />
    </AllSettingsLayout>
  )
}

export const Route = createLazyRoute('/settings')({
  component: Settings,
})

export default Settings

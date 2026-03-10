import {
  createLazyRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { Loader } from 'lucide-react'

import { useUserState } from '@/core/hooks/user-state.hook'

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
  const location = useLocation()
  const navigate = useNavigate()

  const params = new URLSearchParams(location.search)
  const activeTab = resolveSettingTab(params.get('tab') ?? params.get('tabs'))
  const activeItem = getSettingsItemByTab(activeTab)

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
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      <activeItem.contentComponent user={user} />
    </AllSettingsLayout>
  )
}

export const Route = createLazyRoute('/settings')({
  component: Settings,
})

export default Settings

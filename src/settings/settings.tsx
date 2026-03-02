import {
  createLazyRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { Loader } from 'lucide-react'
import { useMemo } from 'react'

import { useUserState } from '@/core/hooks/user-state.hook'

import {
  getSettingsItemByTab,
  resolveSettingTab,
  settingsTabType,
} from './config/settings.config'
import AllSettingsLayout from './layouts/all-settings-layout'

/**
 * Settings component - Main settings page with tabbed interface
 * Manages account, social platforms, and billing settings
 */
const Settings = () => {
  // --- Hooks ---
  const user = useUserState()
  const location = useLocation()
  const navigate = useNavigate()

  // --- State Management ---
  // Parse URL search parameters for tab navigation
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  )
  const activeTab = resolveSettingTab(
    searchParams.get('tab') ?? searchParams.get('tabs')
  )
  const activeItem = getSettingsItemByTab(activeTab)

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
      {!user ? (
        <div className="flex min-h-40 items-center justify-center">
          <Loader className="size-4 animate-spin" />
        </div>
      ) : (
        <activeItem.contentComponent user={user} />
      )}
    </AllSettingsLayout>
  )
}

export const Route = createLazyRoute('/settings')({
  component: Settings,
})

export default Settings

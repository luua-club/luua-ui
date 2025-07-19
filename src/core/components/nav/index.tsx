import { useRouterState } from '@tanstack/react-router'
import { LucidePanelRight } from 'lucide-react'

import { useAppSelector } from '@/core/hooks/global-state.hook'
import { urlType } from '@/core/models/urls.model'
import ThemeToggle from '@/shared/components/theme-toggle'

import { NavUser } from './NavUser'

interface INavProps {
  handleSidebar: () => void
}

function Nav({ handleSidebar }: INavProps) {
  const state = useRouterState()
  const user = useAppSelector(state => state.auth.user)

  // Variables
  const pathname = state.location.pathname as urlType
  const currentPageTitle = getCurrentPageTitle(pathname)

  return (
    <nav className="dark:bg-sidebar flex h-14 justify-between border-b-1 p-2">
      <div className="flex items-center">
        {/* Sidebar toggle */}
        <LucidePanelRight
          className="cursor-pointer text-gray-500 dark:text-white"
          onClick={handleSidebar}
        />
        {/* Page title */}
        <h1 className="pl-4 text-lg font-medium text-gray-500 dark:text-white">
          {currentPageTitle}
        </h1>
      </div>
      <div className="flex items-center">
        {/* Dark mode toggle */}
        <ThemeToggle className="mr-4" />

        {/* User info */}
        {user && <NavUser user={user} />}
      </div>
    </nav>
  )
}

/**
 * Get the current page title based on the pathname
 *
 * @param pathname urlType - The pathname of the current page
 * @returns The title of the current page
 */
const getCurrentPageTitle = (pathname: urlType) => {
  switch (pathname) {
    case '/dashboard':
      return 'Dashboard'
    case '/settings':
      return 'Settings'
    case '/quick-share':
      return 'Quick Share'
    default:
      return 'Dashboard'
  }
}

export default Nav

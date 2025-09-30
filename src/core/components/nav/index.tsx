import { useRouterState } from '@tanstack/react-router'
import { LucidePanelRight } from 'lucide-react'

import { useUserState } from '@/core/hooks/user-state.hook'
import { urlType } from '@/core/models/urls.model'
import ThemeToggle from '@/shared/components/theme-toggle'

import { NavUser } from './NavUser'

interface INavProps {
  handleSidebar: () => void
}

function Nav({ handleSidebar }: INavProps) {
  const state = useRouterState()
  const user = useUserState()

  // Variables
  const pathname = state.location.pathname as urlType
  const currentPageTitle = getCurrentPageTitle(pathname)

  return (
    <nav className="flex h-14 justify-between border-b-1 p-2">
      <div className="flex items-center">
        {/* Sidebar toggle */}
        <LucidePanelRight
          className="size-5 cursor-pointer text-gray-500 dark:text-white"
          onClick={handleSidebar}
        />
        {/* Page title */}
        <h1 className="text-normal pl-3 font-medium text-gray-500 dark:font-normal dark:text-white">
          {currentPageTitle}
        </h1>
      </div>
      <div className="flex items-center">
        {/* Dark mode toggle */}
        <ThemeToggle className="mr-4" />

        {/* User info */}
        <NavUser user={user} />
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
    case '/creation/create':
      return 'Create'
    case '/creation/drafts':
      return 'Saved Drafts'
    case '/schedule':
      return 'Schedule'
    case '/published':
      return 'Published'
    case '/preferences':
      return 'Preferences'
    case '/auto-gen/inspiration':
      return 'Inspiration'
    case '/auto-gen/drafts':
      return 'AI Drafts'
    case '/payments':
      return 'Payments'
    default:
      return 'Dashboard'
  }
}

export default Nav

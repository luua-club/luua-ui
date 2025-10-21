import { useRouterState } from '@tanstack/react-router'
import { LucidePanelRight } from 'lucide-react'

import { useUserState } from '@/core/hooks/user-state.hook'
import { urlType } from '@/core/models/urls.model'
import ThemeToggle from '@/shared/components/theme-toggle'
import { Badge } from '@/shared/ui/badge'
import { Separator } from '@/shared/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

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
    <nav className="h-nav-height flex justify-between border-b-1 p-2">
      <div className="flex items-center gap-2">
        {/* Sidebar toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <LucidePanelRight
              className="size-4 cursor-pointer"
              onClick={handleSidebar}
            />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            Expand / Collapse Sidebar, CTRL+B
          </TooltipContent>
        </Tooltip>

        {/* Page title */}
        <h1 className="truncate text-sm font-medium">{currentPageTitle}</h1>
      </div>
      <div className="flex items-center">
        {/* Dark mode toggle */}
        <ThemeToggle />
        <Separator orientation="vertical" className="mr-1 ml-3 !h-7" />
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
      return 'User Settings'
    case '/creation/create':
      return 'Create New Post'
    case '/creation/drafts':
      return 'Saved Drafts Posts'
    case '/schedule':
      return 'Scheduled Posts'
    case '/published':
      return 'Published Posts'
    case '/preferences':
      return 'User AI Preferences'
    case '/auto-gen/inspiration':
      return 'Inspiration Board'
    case '/auto-gen/drafts':
      return 'AI Drafts Post'
    case '/payments':
      return 'Payments & Pricing'
    default:
      return 'Dashboard'
  }
}

export default Nav

import { useRouterState } from '@tanstack/react-router'
import { LucidePanelRight } from 'lucide-react'

import { useAppSelector } from '@/core/hooks/global-state.hook'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import WelcomeNavRight from '@/welcome/components/welcome-nav-right'

import { urlType } from '../models/urls.model'

interface INavProps {
  handleSidebar: () => void
}

function Nav({ handleSidebar }: INavProps) {
  const state = useRouterState()
  const rightSideComponentKey = useAppSelector(
    state => state.navbarState.rightSideComponentKey
  )

  // Render the appropriate component based on the key
  const renderRightComponent = () => {
    switch (rightSideComponentKey) {
      case 'welcome':
        return <WelcomeNavRight />
      default:
        return null
    }
  }

  /**
   * Get the current page title based on the pathname
   *
   * @param pathname urlType - The pathname of the current page
   * @returns The title of the current page
   */
  const getCurrentPageTitle = (pathname: urlType) => {
    switch (pathname) {
      case '/welcome':
        return 'Get Started'
      case '/bookmarks':
        return 'Saved Bookmarks'
      case '/autopilot':
        return 'Auto Pilot'
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
      case '/payments':
        return 'Payments & Pricing'
      default:
        return ''
    }
  }

  return (
    <nav className="flex justify-between px-4 pt-3 md:px-2">
      {/* Left Side */}
      <div className="flex items-center gap-2">
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
        <p className="text-sm font-semibold">
          {getCurrentPageTitle(state.location.pathname as urlType)}
        </p>
      </div>

      {/* Right Side */}
      {renderRightComponent()}
    </nav>
  )
}

export default Nav

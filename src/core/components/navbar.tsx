import { LucidePanelRight } from 'lucide-react'

import { useAppSelector } from '@/core/hooks/global-state.hook'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import WelcomeNavRight from '@/welcome/components/welcome-nav-right'

interface INavProps {
  handleSidebar: () => void
}

function Nav({ handleSidebar }: INavProps) {
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
      </div>

      {/* Right Side */}
      {renderRightComponent()}
    </nav>
  )
}

export default Nav

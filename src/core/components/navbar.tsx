import { LucidePanelRight } from 'lucide-react'

import { useAppSelector } from '@/core/hooks/global-state.hook'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

interface INavProps {
  handleSidebar: () => void
}

function Nav({ handleSidebar }: INavProps) {
  const rightSideComponent = useAppSelector(
    state => state.navbarState.rightSideComponent
  )

  return (
    <nav className="flex justify-between px-2 pt-3">
      {/* Left Side */}
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

      {/* Right Side */}
      {rightSideComponent}
    </nav>
  )
}

export default Nav

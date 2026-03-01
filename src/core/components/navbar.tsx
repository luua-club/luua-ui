import { LucidePanelRight } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

interface INavProps {
  handleSidebar: () => void
}

function Nav({ handleSidebar }: INavProps) {
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
    </nav>
  )
}

export default Nav

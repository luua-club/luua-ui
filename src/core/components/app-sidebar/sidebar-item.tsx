import { Link } from '@tanstack/react-router'

import { ISidebarItem } from '@/core/models/sidebar.model'
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import { cn } from '@/shared/utils'

interface IAppSidebarItemProps {
  item: ISidebarItem
}

function AppSideBarItem({ item }: IAppSidebarItemProps) {
  // --- State and Variables ---
  const linkClassName = cn(
    '[&.active]:font-semibold [&.active]:text-black',
    'dark:[&.active]:bg-sidebar-accent dark:[&.active]:font-bold dark:[&.active]:text-white'
  )

  // --- Hooks ---
  const { isMobile, setOpenMobile } = useSidebar()

  // --- Handlers ---
  /**
   * Handles the click event of the sidebar item

   */
  const handleClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  /**
   * Renders the content of the sidebar item
   *
   * @returns The content of the sidebar item
   */
  const renderContent = () => {
    if (item.externalUrl) {
      return (
        <a
          href={item.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          <ItemWithIcon item={item} />
        </a>
      )
    }

    return (
      <Link
        to={item.url}
        params={item.params}
        search={item.search}
        className={linkClassName}
      >
        <ItemWithIcon item={item} />
      </Link>
    )
  }

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton tooltip={item.title} asChild onClick={handleClick}>
        {renderContent()}
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

interface IItemWithIconProps {
  item: Pick<ISidebarItem, 'icon' | 'title' | 'ping' | 'tooltip'>
}

const ItemWithIcon = ({ item }: IItemWithIconProps) => {
  const Icon = item.icon
  return (
    <>
      {Icon && <Icon />}
      <span>{item.title}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          {item.ping && (
            <span
              className={cn(
                'size-1.5 animate-pulse rounded-full',
                item.ping === 'success' ? 'bg-green-500' : 'bg-yellow-400'
              )}
            ></span>
          )}
        </TooltipTrigger>
        <TooltipContent>{item.tooltip}</TooltipContent>
      </Tooltip>
    </>
  )
}

export default AppSideBarItem

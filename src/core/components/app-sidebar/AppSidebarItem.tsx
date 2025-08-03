import { Link } from '@tanstack/react-router'

import { ISidebarItem } from '@/core/models/sidebar.model'
import { SidebarMenuButton, SidebarMenuItem } from '@/shared/ui/sidebar'
import { cn } from '@/shared/utils'

interface IAppSidebarItemProps {
  item: ISidebarItem
}

function AppSideBarItem({ item }: IAppSidebarItemProps) {
  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton tooltip={item.title} asChild>
        {item.url ? (
          <Link
            to={item.url}
            className={cn(
              'text-gray-500 [&.active]:border-1 [&.active]:font-semibold [&.active]:text-black',
              'dark:border-none dark:text-gray-400 dark:[&.active]:text-white'
            )}
          >
            <ItemWithIcon item={item} />
          </Link>
        ) : (
          <SidebarMenuButton
            tooltip={item.title}
            className={cn(
              'text-gray-500 outline-1',
              'dark:text-gray-400 dark:[&.active]:text-white'
            )}
          >
            <ItemWithIcon item={item} />
          </SidebarMenuButton>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

interface IItemWithIconProps {
  item: Pick<ISidebarItem, 'icon' | 'title' | 'ping'>
}

const ItemWithIcon = ({ item }: IItemWithIconProps) => {
  return (
    <>
      {item.icon}
      <span>{item.title}</span>
      {item.ping && (
        <span
          className={cn(
            'size-1.5 animate-pulse rounded-full',
            item.ping === 'success' ? 'bg-green-500' : 'bg-red-500'
          )}
        ></span>
      )}
    </>
  )
}

export default AppSideBarItem

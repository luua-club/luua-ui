import { Link } from '@tanstack/react-router'

import { ISidebarItem } from '@/core/models/sidebar.model'
import { SidebarMenuButton, SidebarMenuItem } from '@/shared/ui/sidebar'

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
            className="text-gray-500 [&.active]:border-1 [&.active]:font-semibold [&.active]:text-black"
          >
            <ItemWithIcon item={item} />
          </Link>
        ) : (
          <SidebarMenuButton tooltip={item.title} className="text-gray-500">
            <ItemWithIcon item={item} />
          </SidebarMenuButton>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

interface IItemWithIconProps {
  item: Pick<ISidebarItem, 'icon' | 'title'>
}

const ItemWithIcon = ({ item }: IItemWithIconProps) => {
  return (
    <>
      {item.icon}
      <span>{item.title}</span>
    </>
  )
}

export default AppSideBarItem

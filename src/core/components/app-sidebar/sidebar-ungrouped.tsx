import { ISidebarItem } from '@/core/models/sidebar.model'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from '@/shared/ui/sidebar'

import AppSideBarItem from './sidebar-item'

interface IAppSidebarUngroupedProps {
  ungroupedItems: ISidebarItem[]
}

function AppSidebarUngrouped({ ungroupedItems }: IAppSidebarUngroupedProps) {
  return (
    <SidebarGroup className="py-0">
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {ungroupedItems.map(item => (
            <AppSideBarItem key={item.title} item={item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default AppSidebarUngrouped

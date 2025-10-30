import { ISidebarItem } from '@/core/models/sidebar.model'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/shared/ui/sidebar'

import AppSideBarItem from './sidebar-item'

interface IAppSidebarCreationProps {
  creationsItems: ISidebarItem[]
}

function AppSidebarCreation({ creationsItems }: IAppSidebarCreationProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <span className="dark:text-white">Creations</span>
      </SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {creationsItems.map(item => (
            <AppSideBarItem key={item.title} item={item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default AppSidebarCreation

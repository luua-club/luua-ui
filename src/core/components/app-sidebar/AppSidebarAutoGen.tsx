import { ISidebarItem } from '@/core/models/sidebar.model'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/shared/ui/sidebar'

import AppSideBarItem from './AppSidebarItem'

interface IAppSidebarAutoGenProps {
  autoGenItems?: ISidebarItem[]
}

function AppSidebarAutoGen({ autoGenItems }: IAppSidebarAutoGenProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <span className="dark:text-white">Auto Generation</span>
      </SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {autoGenItems?.map(item => (
            <AppSideBarItem key={item.title} item={item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default AppSidebarAutoGen

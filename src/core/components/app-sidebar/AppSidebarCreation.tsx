import { ISidebarItem } from '@/core/models/sidebar.model'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/shared/ui/sidebar'

import AppSideBarItem from './AppSidebarItem'

interface IAppSidebarCreationProps {
  creationsData: ISidebarItem[]
}

function AppSidebarCreation({ creationsData }: IAppSidebarCreationProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <span className="dark:text-white">Creations</span>
      </SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {creationsData.map(item => (
            <AppSideBarItem key={item.title} item={item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default AppSidebarCreation

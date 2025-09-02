import { ISidebarItem } from '@/core/models/sidebar.model'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/shared/ui/sidebar'

import AppSidebarCollapsedItem from './AppSidebarCollapsedItem'

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
          {creationsData.map(data => (
            <AppSidebarCollapsedItem key={data.title} item={data} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default AppSidebarCreation

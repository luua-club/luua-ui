import { ISidebarItem } from '@/core/models/sidebar.model'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/shared/ui/sidebar'

import AppSidebarCreation from './AppSidebarCreation'
import AppSidebarFooter from './AppSidebarFooter'
import AppSidebarHeader from './AppSidebarHeader'
import AppSidebarPlatform from './AppSidebarPlatform'

interface IAppSidebarProps {
  platformItems: ISidebarItem[]
  creationsData?: ISidebarItem[]
}

function AppSidebar({ platformItems, creationsData }: IAppSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <AppSidebarHeader />
      </SidebarHeader>
      <SidebarContent>
        <AppSidebarPlatform platformItems={platformItems} />
        <AppSidebarCreation creationsData={creationsData} />
      </SidebarContent>
      <SidebarFooter>
        <AppSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar

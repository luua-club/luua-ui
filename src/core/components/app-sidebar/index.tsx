import { ISidebarItem } from '@/core/models/sidebar.model'
import { Separator } from '@/shared/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/shared/ui/sidebar'

import AppSidebarAutoGen from './AppSidebarAutoGen'
import AppSidebarCreation from './AppSidebarCreation'
import AppSidebarFooter from './AppSidebarFooter'
import AppSidebarHeader from './AppSidebarHeader'
import AppSidebarPlatform from './AppSidebarPlatform'
import AppSidebarPosts from './AppSidebarPosts'

interface IAppSidebarProps {
  platformItems: ISidebarItem[]
  creationsData: ISidebarItem[]
  postsItems: ISidebarItem[]
  autoGenItems: ISidebarItem[]
}

function AppSidebar({
  platformItems,
  creationsData,
  postsItems,
  autoGenItems,
}: IAppSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <AppSidebarHeader />
      </SidebarHeader>
      <SidebarContent>
        <AppSidebarPlatform platformItems={platformItems} />
        <Separator />
        <AppSidebarCreation creationsData={creationsData} />
        <AppSidebarPosts postsItems={postsItems} />
        <AppSidebarAutoGen autoGenItems={autoGenItems} />
      </SidebarContent>
      <SidebarFooter>
        <AppSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar

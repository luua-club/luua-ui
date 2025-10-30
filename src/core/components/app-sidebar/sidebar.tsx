import {
  autoGenItems,
  creationItems,
  platformItems,
  postsItems,
} from '@/core/config/sidebar.config'
import { Separator } from '@/shared/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/shared/ui/sidebar'

import AppSidebarAutoGen from './sidebar-autogen'
import AppSidebarCreation from './sidebar-creation'
import AppSidebarFooter from './sidebar-footer'
import AppSidebarHeader from './sidebar-header'
import AppSidebarPlatform from './sidebar-platform'
import AppSidebarPosts from './sidebar-posts'

function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader>
        <AppSidebarHeader />
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <AppSidebarPlatform platformItems={platformItems} />
        <Separator />
        <AppSidebarCreation creationsItems={creationItems} />
        <AppSidebarPosts postsItems={postsItems} />
        <AppSidebarAutoGen autoGenItems={autoGenItems} />
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <AppSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar

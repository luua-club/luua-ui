import {
  creationItems,
  postsItems,
  ungroupedItems,
} from '@/core/config/sidebar.config'
import { Separator } from '@/shared/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/shared/ui/sidebar'

import AppSidebarCreation from './sidebar-creation'
import AppSidebarFooter from './sidebar-footer'
import AppSidebarHeader from './sidebar-header'
import AppSidebarPosts from './sidebar-posts'
import AppSidebarUngrouped from './sidebar-ungrouped'

function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader>
        <AppSidebarHeader />
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <AppSidebarUngrouped ungroupedItems={ungroupedItems} />
        <Separator />
        <AppSidebarCreation creationsItems={creationItems} />
        <AppSidebarPosts postsItems={postsItems} />
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <AppSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar

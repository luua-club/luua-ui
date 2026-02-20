import { ungroupedItems } from '@/core/config/sidebar.config'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/shared/ui/sidebar'

import AppSidebarAllPosts from './sidebar-all-posts'
import AppSidebarAutomation from './sidebar-automation'
import AppSidebarCreateBox from './sidebar-create-box'
import AppSidebarFooter from './sidebar-footer'
import AppSidebarHeader from './sidebar-header'
import AppSidebarUngrouped from './sidebar-ungrouped'

const dashboardItem = ungroupedItems.find(item => item.url === '/creation')!

function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader className="mb-1">
        <AppSidebarHeader />
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {/* 2. Create Box */}
        <AppSidebarCreateBox />

        {/* 1. Welcome */}
        <AppSidebarUngrouped ungroupedItems={[dashboardItem]} />

        {/* 3. All Posts */}
        <AppSidebarAllPosts />

        {/* 5. Automation */}
        <AppSidebarAutomation />
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <AppSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar

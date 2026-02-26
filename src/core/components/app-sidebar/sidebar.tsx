import { PanelRightOpen } from 'lucide-react'

import { ungroupedItems } from '@/core/config/sidebar.config'
import { Button } from '@/shared/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/shared/ui/sidebar'

import AppSidebarAllPosts from './sidebar-all-posts'
import AppSidebarAutomation from './sidebar-automation'
import AppSidebarCreateBox from './sidebar-create-box'
import AppSidebarFooter from './sidebar-footer'
import AppSidebarHeader from './sidebar-header'
import AppSidebarUngrouped from './sidebar-ungrouped'

const dashboardItem = ungroupedItems.find(item => item.url === '/dashboard')!

function AppSidebar() {
  const { isMobile, toggleSidebar } = useSidebar()

  return (
    <>
      {isMobile && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="bg-background/95 fixed top-3 left-3 z-40 size-8 shadow-sm md:hidden"
          aria-label="Open sidebar"
        >
          <PanelRightOpen className="size-4" />
        </Button>
      )}

      <Sidebar collapsible="icon">
        {/* Header */}
        <SidebarHeader className="mb-1">
          <AppSidebarHeader />
        </SidebarHeader>

        {/* Content */}
        <SidebarContent>
          {/* Dashboard */}
          <AppSidebarUngrouped ungroupedItems={[dashboardItem]} />

          {/* Create Box */}
          <AppSidebarCreateBox />

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
    </>
  )
}

export default AppSidebar

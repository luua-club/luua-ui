import { PanelRightOpen } from 'lucide-react'

import { coreLinks } from '@/core/config/sidebar.config'
import { Button } from '@/shared/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/shared/ui/sidebar'

import AppSidebarAllPosts from './sidebar-all-posts'
import AppSidebarAutomation from './sidebar-automation'
import AppSidebarFooter from './sidebar-footer'
import AppSidebarHeader from './sidebar-header'
import AppSidebarUngrouped from './sidebar-ungrouped'

const dashboardItem = coreLinks.find(item => item.url === '/dashboard')!
const analyticsItem = coreLinks.find(item => item.url === '/analytics')!
const allPostsItem = coreLinks.find(item => item.url === '/posts-view')!

function AppSidebar() {
  const { isMobile, openMobile, toggleSidebar } = useSidebar()

  return (
    <>
      {isMobile && !openMobile && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="bg-background/90 fixed top-1/2 left-0 z-30 h-18 w-4 -translate-y-1/2 rounded-r-md border border-l-0 px-0 shadow-sm md:hidden"
          aria-label="Open sidebar"
        >
          <PanelRightOpen className="size-3" />
        </Button>
      )}

      <Sidebar collapsible="icon">
        {/* Header */}
        <SidebarHeader className="hover:bg-secondary border-b py-0">
          <AppSidebarHeader />
        </SidebarHeader>

        {/* Content */}
        <SidebarContent>
          {/* Core Navigation */}
          <AppSidebarUngrouped
            ungroupedItems={[dashboardItem, analyticsItem]}
          />
          <AppSidebarAllPosts item={allPostsItem} />

          {/* Automation */}
          <AppSidebarAutomation />
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter>
          <AppSidebarFooter />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
    </>
  )
}

export default AppSidebar

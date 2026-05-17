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
          className="bg-background/95 fixed top-1/2 left-2 z-40 flex h-12 w-10 -translate-y-1/2 items-center justify-center rounded-r-lg border px-0 shadow-md"
          aria-label="Open sidebar"
        >
          <PanelRightOpen className="size-4" />
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

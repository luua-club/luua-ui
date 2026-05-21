import { coreLinks, workActions } from '@/core/config/sidebar.config'
import { type ISidebarItem } from '@/core/models/sidebar.model'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from '@/shared/ui/sidebar'

import AppSideBarItem from './sidebar-item'

const dashboardItem = coreLinks.find(item => item.url === '/dashboard')!
const analyticsItem = coreLinks.find(item => item.url === '/analytics')!

const createItem: ISidebarItem = {
  title: workActions[0].title,
  url: workActions[0].url,
  icon: workActions[0].icon,
}

/** Full-width rule matching SidebarHeader project picker border-b. */
function SidebarFullWidthDivider() {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className="border-sidebar-border min-h-px w-full shrink-0 border-b"
    />
  )
}

function SidebarPrimaryNav() {
  return (
    <>
      <SidebarGroup className="p-0">
        <SidebarGroupContent className="w-full">
          <div className="bg-muted dark:bg-sidebar-accent w-full py-2">
            <SidebarMenu className="gap-1 px-2">
              <AppSideBarItem item={dashboardItem} />
              <AppSideBarItem item={createItem} />
            </SidebarMenu>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarFullWidthDivider />

      <SidebarGroup className="py-2">
        <SidebarGroupContent>
          <SidebarMenu className="gap-1">
            <AppSideBarItem item={analyticsItem} />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}

export default SidebarPrimaryNav

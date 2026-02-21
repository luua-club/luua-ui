import { PanelLeft } from 'lucide-react'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/ui/sidebar'

import { AppIconLogo, AppTextLogo } from '../app-logo'

function AppSidebarHeader() {
  // --- Hooks ---
  const { toggleSidebar } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          className="data-[slot=sidebar-menu-button]:!p-1.5"
          onClick={toggleSidebar}
        >
          {/* Icon slot: logo fades out on sidebar hover when collapsed, expand icon fades in */}
          <span className="relative inline-flex size-5 shrink-0 items-center justify-center">
            <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-150 group-data-[collapsible=icon]:group-hover:opacity-0">
              <AppIconLogo />
            </span>
            <PanelLeft className="absolute !size-4 opacity-0 transition-opacity duration-150 group-data-[collapsible=icon]:group-hover:opacity-100" />
          </span>

          {/* Text: visible only in expanded state */}
          <AppTextLogo className="group-data-[collapsible=icon]:hidden" />

          {/* Collapse button: right side, expanded state only */}
          <PanelLeft className="ml-auto !size-4 shrink-0 group-data-[collapsible=icon]:hidden" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default AppSidebarHeader

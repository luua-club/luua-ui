import { Link } from '@tanstack/react-router'
import { LucideDessert } from 'lucide-react'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/sidebar'

function AppSidebarHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          className="data-[slot=sidebar-menu-button]:!p-1.5"
        >
          <Link to="/dashboard">
            <LucideDessert className="!size-5" />
            <div className="flex w-full items-center justify-between">
              <span className="truncate text-base font-semibold">Luua AI.</span>
              <span className="truncate rounded-md border-1 border-gray-200 bg-white px-2 py-0.5 text-sm">
                Free
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default AppSidebarHeader

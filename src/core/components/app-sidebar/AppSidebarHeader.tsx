import { Link } from '@tanstack/react-router'
import { LucideDessert } from 'lucide-react'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/sidebar'
import { cn } from '@/shared/utils'

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
              <span
                className={cn(
                  'truncate rounded-sm border-1 border-gray-200 bg-white px-3 py-0.5 text-xs',
                  'dark:rounded-xs dark:border-dashed dark:border-amber-500 dark:bg-transparent dark:text-amber-500'
                )}
              >
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

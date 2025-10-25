import { Link } from '@tanstack/react-router'

import { useUserState } from '@/core/hooks/user-state.hook'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/sidebar'
import { cn } from '@/shared/utils'

import { AppIconLogo, AppTextLogo } from '../app-logo'

function AppSidebarHeader() {
  const user = useUserState()
  const isProPlan = user?.plan === 'Pro'

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          className="data-[slot=sidebar-menu-button]:!p-1.5"
        >
          <Link to="/dashboard">
            {/* Logo Icon */}
            <AppIconLogo />

            <div className="flex w-full items-center justify-between">
              {/* Logo Text */}
              <div className="flex items-center gap-1">
                <AppTextLogo />
              </div>

              {isProPlan ? (
                <span
                  className={cn(
                    'bg-brand-accent-yellow truncate rounded-xs px-3 py-0.5 text-xs font-semibold text-black'
                  )}
                >
                  Pro
                </span>
              ) : (
                <span
                  className={cn(
                    'truncate rounded-xs border-1 border-gray-200 bg-white px-3 py-0.5 text-xs font-semibold',
                    'dark:bg-accent dark:text-accent-foreground dark:border-transparent'
                  )}
                >
                  Free
                </span>
              )}
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default AppSidebarHeader

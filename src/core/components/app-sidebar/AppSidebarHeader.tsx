import { Link } from '@tanstack/react-router'

import LogoIconOnly from '@/assets/images/luua-black-icon.svg?react'
import LogoTextOnly from '@/assets/images/luua-black-text.svg?react'
import LogoIconOnlyDark from '@/assets/images/luua-white-icon.svg?react'
import LogoTextOnlyDark from '@/assets/images/luua-white-text.svg?react'
import { useUserState } from '@/core/hooks/user-state.hook'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/sidebar'
import { cn } from '@/shared/utils'

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
            <LogoIconOnly aria-label="Icon" className="!size-5 dark:hidden" />

            <LogoIconOnlyDark
              aria-label="Icon"
              className="hidden !size-5 dark:block"
            />

            {/* Logo Text */}
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-1">
                <LogoTextOnly
                  aria-label="Text"
                  className="!size-12 dark:hidden"
                />

                <LogoTextOnlyDark
                  aria-label="Text"
                  className="hidden !size-12 dark:block"
                />
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

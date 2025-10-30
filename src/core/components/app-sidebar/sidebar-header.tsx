import { Link } from '@tanstack/react-router'

import { useUserState } from '@/core/hooks/user-state.hook'
import ChipBadge from '@/shared/components/chip-badge'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/sidebar'

import { AppIconLogo, AppTextLogo } from '../app-logo'

function AppSidebarHeader() {
  // --- Hooks ---
  const user = useUserState()

  // --- Computed Variables ---
  const isProPlan = user?.plan === 'Pro'

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          className="data-[slot=sidebar-menu-button]:!p-1.5"
        >
          <Link to="/welcome">
            {/* Logo Icon */}
            <AppIconLogo />

            <div className="flex w-full items-center justify-between">
              {/* Logo Text */}
              <div className="flex items-center gap-1">
                <AppTextLogo />
              </div>

              {/* Free or Pro */}
              {isProPlan ? (
                <ChipBadge variant="hot">Pro</ChipBadge>
              ) : (
                <ChipBadge variant="cold">Free</ChipBadge>
              )}
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default AppSidebarHeader

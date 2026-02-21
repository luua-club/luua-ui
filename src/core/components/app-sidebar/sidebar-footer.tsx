import { useUserState } from '@/core/hooks/user-state.hook'
import { SidebarMenu } from '@/shared/ui/sidebar'

import AppSidebarTabCTA from './sidebar-tab-cta'
import { UserSidebarCard } from './sidebar-user-card'

function AppSidebarFooter() {
  const user = useUserState()

  return (
    <div className="flex flex-col gap-3">
      <AppSidebarTabCTA />
      <SidebarMenu>
        <UserSidebarCard user={user} />
      </SidebarMenu>
    </div>
  )
}

export default AppSidebarFooter

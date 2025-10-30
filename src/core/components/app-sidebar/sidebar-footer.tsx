import { useUserState } from '@/core/hooks/user-state.hook'
import { SidebarMenu } from '@/shared/ui/sidebar'

import AppSidebarPaymentCTA from './sidebar-payment-cta'
import { UserSidebarCard } from './sidebar-user-card'

function AppSidebarFooter() {
  const user = useUserState()
  const isFreePlan = user?.plan === 'Free'

  return (
    <div className="flex flex-col gap-3">
      {isFreePlan && <AppSidebarPaymentCTA />}
      <SidebarMenu>
        <UserSidebarCard user={user} />
      </SidebarMenu>
    </div>
  )
}

export default AppSidebarFooter

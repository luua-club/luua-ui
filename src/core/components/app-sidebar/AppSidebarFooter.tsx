import { LucideSettings } from 'lucide-react'

import { useUserState } from '@/core/hooks/user-state.hook'
import { SidebarMenu } from '@/shared/ui/sidebar'

import AppSideBarItem from './AppSidebarItem'
import AppSidebarPaymentCTA from './AppSidebarPaymentCTA'

function AppSidebarFooter() {
  const user = useUserState()
  const isFreePlan = user?.plan === 'Free'

  return (
    <div className="flex flex-col gap-3">
      {isFreePlan && <AppSidebarPaymentCTA />}
      <SidebarMenu>
        <AppSideBarItem
          item={{
            title: 'Settings',
            url: '/settings',
            icon: <LucideSettings />,
          }}
        />
      </SidebarMenu>
    </div>
  )
}

export default AppSidebarFooter

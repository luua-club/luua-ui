import { LucideSettings } from 'lucide-react'

import { SidebarMenu } from '@/shared/ui/sidebar'

import AppSideBarItem from './AppSidebarItem'
import AppSidebarPaymentCTA from './AppSidebarPaymentCTA'

function AppSidebarFooter() {
  return (
    <div className="flex flex-col gap-3">
      <AppSidebarPaymentCTA />
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

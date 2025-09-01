import { LucideSettings } from 'lucide-react'

import { SidebarMenu } from '@/shared/ui/sidebar'

import AppSideBarItem from './AppSidebarItem'

function AppSidebarFooter() {
  return (
    <SidebarMenu>
      <AppSideBarItem
        item={{
          title: 'Settings',
          url: '/settings',
          icon: <LucideSettings />,
        }}
      />
    </SidebarMenu>
  )
}

export default AppSidebarFooter

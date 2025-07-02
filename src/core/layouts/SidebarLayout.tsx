import { Outlet } from '@tanstack/react-router'

import AppSidebar from '@/shared/components/AppSidebar'
import { SidebarProvider } from '@/shared/ui/sidebar'

function SidebarLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <nav></nav>
        <main>
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}

export default SidebarLayout

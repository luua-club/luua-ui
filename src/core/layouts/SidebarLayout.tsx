import { Outlet } from '@tanstack/react-router'

import { SidebarProvider } from '@/shared/ui/sidebar'

function SidebarLayout() {
  return (
    <SidebarProvider>
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

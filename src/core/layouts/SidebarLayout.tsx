import { Outlet } from '@tanstack/react-router'
import {
  LucideCable,
  LucideCalendar,
  LucideLayoutDashboard,
  LucidePanelRight,
} from 'lucide-react'
import { useState } from 'react'

import AppSidebar from '@/core/components/app-sidebar'
import { SidebarProvider } from '@/shared/ui/sidebar'

import { ISidebarItem } from '../models/sidebar.model'

function SidebarLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const platformItems: ISidebarItem[] = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: <LucideLayoutDashboard />,
    },
    {
      title: 'Schedule',
      url: undefined,
      icon: <LucideCalendar />,
    },
    {
      title: 'Socials',
      url: undefined,
      icon: <LucideCable />,
    },
  ]

  return (
    <SidebarProvider open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <AppSidebar platformItems={platformItems} creationsData={[]} />
      <div className="w-full">
        <nav className="flex h-12 items-center border-b-1 p-2">
          <LucidePanelRight
            className="cursor-pointer text-gray-400"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </nav>
        <main>
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}

export default SidebarLayout

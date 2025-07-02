import { Outlet } from '@tanstack/react-router'
import {
  LucideCable,
  LucideCalendar,
  LucideLayoutDashboard,
} from 'lucide-react'
import { useState } from 'react'

import AppSidebar from '@/core/components/app-sidebar'
import { THEME_LOCAL_STORAGE_KEY } from '@/shared/constant'
import { ThemeProvider } from '@/shared/provider/theme-provider'
import { SidebarProvider } from '@/shared/ui/sidebar'

import Nav from '../components/nav'
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
      ping: 'success',
      icon: <LucideCable />,
    },
  ]

  return (
    <ThemeProvider defaultTheme="dark" storageKey={THEME_LOCAL_STORAGE_KEY}>
      <SidebarProvider open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <AppSidebar platformItems={platformItems} creationsData={[]} />
        <div className="w-full">
          <Nav handleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main>
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default SidebarLayout

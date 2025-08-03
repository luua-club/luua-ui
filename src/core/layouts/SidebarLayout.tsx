import { Outlet } from '@tanstack/react-router'
import {
  LucideCalendar,
  LucideHistory,
  LucideLayoutDashboard,
} from 'lucide-react'

import AppSidebar from '@/core/components/app-sidebar'
import { THEME_LOCAL_STORAGE_KEY } from '@/shared/constant'
import { ThemeProvider } from '@/shared/provider/theme-provider'
import { SidebarProvider, useSidebar } from '@/shared/ui/sidebar'
import { Toaster } from '@/shared/ui/sonner'

import Nav from '../components/nav'
import { ISidebarItem } from '../models/sidebar.model'

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
    title: 'History',
    url: undefined,
    icon: <LucideHistory />,
  },
]

function SidebarLayout() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey={THEME_LOCAL_STORAGE_KEY}>
      <SidebarProvider>
        <SidebarContent />
      </SidebarProvider>
    </ThemeProvider>
  )
}

// This component is now inside SidebarProvider, so it can use useSidebar
function SidebarContent() {
  const { toggleSidebar } = useSidebar()

  return (
    <>
      <AppSidebar platformItems={platformItems} creationsData={[]} />
      <div className="w-full">
        <Nav handleSidebar={toggleSidebar} />
        <main>
          <Outlet />
        </main>
        <Toaster />
      </div>
    </>
  )
}

export default SidebarLayout

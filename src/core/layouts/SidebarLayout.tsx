import { Outlet } from '@tanstack/react-router'
import {
  Eclipse,
  FolderClock,
  LucideCalendar,
  LucideFileText,
  LucideLayoutDashboard,
} from 'lucide-react'

import AppSidebar from '@/core/components/app-sidebar'
import { SidebarProvider, useSidebar } from '@/shared/ui/sidebar'

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
    url: '/schedule',
    icon: <LucideCalendar />,
  },
  {
    title: 'Published',
    url: '/published',
    icon: <LucideFileText />,
  },
]

const creationItems: ISidebarItem[] = [
  {
    title: 'Saved Drafts',
    url: '/creation/drafts',
    icon: <FolderClock />,
  },
  {
    title: 'Preferences',
    url: '/preferences',
    icon: <Eclipse />,
  },
]

function SidebarLayout() {
  return (
    <SidebarProvider>
      <SidebarContent />
    </SidebarProvider>
  )
}

// This component is now inside SidebarProvider, so it can use useSidebar
function SidebarContent() {
  const { toggleSidebar } = useSidebar()

  return (
    <>
      <AppSidebar platformItems={platformItems} creationsData={creationItems} />
      <div className="w-full">
        <Nav handleSidebar={toggleSidebar} />
        <main>
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default SidebarLayout

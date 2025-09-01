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
    title: 'Your Styles',
    url: '/preferences',
    icon: <Eclipse />,
  },
]

const creationItems: ISidebarItem[] = [
  {
    title: 'Saved Drafts',
    url: '/creation/drafts',
    icon: <FolderClock />,
  },
]

const postsItems: ISidebarItem[] = [
  {
    title: 'Scheduled',
    url: '/schedule',
    icon: <LucideCalendar />,
  },
  {
    title: 'Published',
    url: '/published',
    icon: <LucideFileText />,
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
const SidebarContent = () => {
  const { toggleSidebar } = useSidebar()

  return (
    <>
      <AppSidebar
        platformItems={platformItems}
        creationsData={creationItems}
        postsItems={postsItems}
      />
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

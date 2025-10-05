import { Outlet } from '@tanstack/react-router'
import {
  Cable,
  FileCheck,
  FolderClosed,
  FolderHeart,
  House,
  Lightbulb,
  LucideCalendar,
  Paintbrush,
  PencilRuler,
} from 'lucide-react'
import { useMemo } from 'react'

import AppSidebar from '@/core/components/app-sidebar'
import { SidebarProvider, useSidebar } from '@/shared/ui/sidebar'

import Nav from '../components/nav'
import { useUserState } from '../hooks/user-state.hook'
import { ISidebarItem } from '../models/sidebar.model'
import { areAllSocialsConnectedByPlan } from '../utils/social.utils'

const platformItems: ISidebarItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: <House />,
  },
  {
    title: 'Your Styles',
    url: '/preferences',
    icon: <Paintbrush />,
  },
  {
    title: 'Socials',
    url: '/settings',
    search: {
      tabs: 'socials',
    },
    ping: 'success',
    icon: <Cable />,
  },
]

const creationItems: ISidebarItem[] = [
  {
    title: 'Create New',
    url: '/creation/create',
    icon: <PencilRuler />,
  },
  {
    title: 'Saved Drafts',
    url: '/creation/drafts',
    icon: <FolderClosed />,
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
    icon: <FileCheck />,
  },
]

const autoGenItems: ISidebarItem[] = [
  {
    title: 'Inspiration',
    url: '/auto-gen/inspiration',
    icon: <Lightbulb />,
  },
  {
    title: 'AI Drafts',
    url: '/auto-gen/drafts',
    icon: <FolderHeart />,
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
  // --- Hooks ---
  const { toggleSidebar } = useSidebar()
  const user = useUserState()

  // --- Memoized Variables ---
  /**
   * Memoize the social connection status check
   */
  const areAllSocialsConnected = useMemo(
    () => (user ? areAllSocialsConnectedByPlan(user) : false),
    [user]
  )

  /**
   * Memoize the platform items array to prevent unnecessary re-renders
   */
  const platformItemsWithSocials = useMemo(
    () =>
      platformItems.map(item => {
        if (item.title === 'Socials') {
          return {
            ...item,
            ping: areAllSocialsConnected ? 'success' : 'error',
            tooltip: areAllSocialsConnected
              ? 'All socials connected'
              : 'Some socials not connected',
          }
        }

        return item
      }) as ISidebarItem[],
    [areAllSocialsConnected]
  )

  return (
    <>
      <AppSidebar
        platformItems={platformItemsWithSocials}
        creationsData={creationItems}
        postsItems={postsItems}
        autoGenItems={autoGenItems}
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

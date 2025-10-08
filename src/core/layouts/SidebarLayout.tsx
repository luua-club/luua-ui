import { Outlet, useRouterState } from '@tanstack/react-router'
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
import { useMemo, useRef } from 'react'

import AppSidebar from '@/core/components/app-sidebar'
import GlobalLoader from '@/shared/components/global-loader'
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
  const routerState = useRouterState()

  // --- Refs ---
  // Track the current pathname to detect actual route changes vs query param changes
  const previousPathnameRef = useRef(routerState.location.pathname)

  // --- Computed Variables ---
  // Only show loader if we're navigating to a different route (pathname change)
  // Not for query param changes on the same route
  const isRoutePending = routerState.status === 'pending'
  const isPathnameChanging =
    previousPathnameRef.current !== routerState.location.pathname
  const shouldShowLoader = isRoutePending && isPathnameChanging

  // Update ref when pathname actually changes
  if (routerState.status !== 'pending') {
    previousPathnameRef.current = routerState.location.pathname
  }

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
        <main>{shouldShowLoader ? <GlobalLoader /> : <Outlet />}</main>
      </div>
    </>
  )
}

export default SidebarLayout

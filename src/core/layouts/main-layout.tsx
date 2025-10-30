import { Outlet, useRouterState } from '@tanstack/react-router'
import { useRef } from 'react'

import AppSidebar from '@/core/components/app-sidebar/sidebar'
import GlobalLoader from '@/shared/components/global-loader'
import { SidebarProvider, useSidebar } from '@/shared/ui/sidebar'

import Nav from '../components/navbar'

function MainLayout() {
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

  return (
    <>
      <AppSidebar />
      <div className="w-full">
        <Nav handleSidebar={toggleSidebar} />
        <main>{shouldShowLoader ? <GlobalLoader /> : <Outlet />}</main>
      </div>
    </>
  )
}

export default MainLayout

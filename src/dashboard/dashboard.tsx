import { createLazyRoute } from '@tanstack/react-router'
import { lazy } from 'react'

import AsyncSectionBoundary from '@/shared/components/async-section-boundary'

import {
  DashboardDraftGridSkeleton,
  ProfileActivitySkeleton,
} from './components/dashboard-skeletons'

const ProfileActivity = lazy(() => import('./containers/profile-activity'))
const DashboardDraftGrid = lazy(
  () => import('./containers/dashboard-draft-grid')
)
const WelcomeDrawer = lazy(() => import('./components/welcome-drawer'))

function DashboardPage() {
  return (
    <div className="bg-secondary dark:bg-secondary/70 relative min-h-screen px-4 pt-6 pb-[max(7rem,calc(env(safe-area-inset-bottom,0px)+5rem))] sm:px-8 sm:pt-8">
      <div className="mx-auto max-w-5xl min-w-0">
        <AsyncSectionBoundary
          title="Profile activity"
          fallback={<ProfileActivitySkeleton />}
        >
          <ProfileActivity />
        </AsyncSectionBoundary>
      </div>
      <div className="mx-auto mt-10 max-w-5xl min-w-0">
        <AsyncSectionBoundary
          title="Drafts"
          fallback={<DashboardDraftGridSkeleton />}
        >
          <DashboardDraftGrid />
        </AsyncSectionBoundary>
      </div>
      <AsyncSectionBoundary title="Welcome drawer" fallback={null}>
        <WelcomeDrawer />
      </AsyncSectionBoundary>
    </div>
  )
}

export const Route = createLazyRoute('/dashboard')({
  component: DashboardPage,
})

export default DashboardPage

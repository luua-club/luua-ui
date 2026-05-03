import { createLazyRoute } from '@tanstack/react-router'

import WelcomeDrawer from '@/dashboard/components/welcome-drawer'

import DashboardDraftGrid from './containers/dashboard-draft-grid'
import ProfileActivity from './containers/profile-activity'

function DashboardPage() {
  return (
    <div className="bg-secondary dark:bg-secondary/70 relative min-h-screen p-8">
      <div className="mx-auto max-w-5xl">
        <ProfileActivity />
      </div>
      <div className="mt-10">
        <DashboardDraftGrid />
      </div>
      <WelcomeDrawer />
    </div>
  )
}

export const Route = createLazyRoute('/dashboard')({
  component: DashboardPage,
})

export default DashboardPage

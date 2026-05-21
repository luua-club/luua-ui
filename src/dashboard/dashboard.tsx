import { createLazyRoute } from '@tanstack/react-router'

import WelcomeDrawer from './components/welcome-drawer'
import DashboardDraftGrid from './containers/dashboard-draft-grid'
import ProfileActivity from './containers/profile-activity'

function DashboardPage() {
  return (
    <div className="bg-secondary dark:bg-secondary/70 relative min-h-screen px-4 pt-6 pb-[max(7rem,calc(env(safe-area-inset-bottom,0px)+5rem))] sm:px-8 sm:pt-8">
      <div className="mx-auto max-w-5xl min-w-0">
        <ProfileActivity />
      </div>
      <div className="mx-auto mt-10 max-w-5xl min-w-0">
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

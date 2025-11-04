import { createLazyRoute, useLocation } from '@tanstack/react-router'
import { LampDesk } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useUserState } from '@/core/hooks/user-state.hook'
import { removeQueryParams } from '@/core/utils/common.util'
import GlobalLoader from '@/shared/components/global-loader'
import FeaturesGrid from '@/welcome/components/features-grid'

import ProWelcomeBanner from './components/pro-welcome-banner'

function Welcome() {
  // --- States ---
  const [isProWelcomeBannerOpen, setIsProWelcomeBannerOpen] = useState(false)

  // --- Hooks ---
  const location = useLocation()
  const user = useUserState()

  //--- Effects ---
  /**
   * Check for welcome and pro query parameters and open drawers.
   */
  useEffect(() => {
    // query parameters
    const params = new URLSearchParams(location.search)
    const pro = params.get('pro')

    // query parameters - Pro
    if (pro === 'true') {
      setIsProWelcomeBannerOpen(true)
      removeQueryParams(params, ['pro'])
    }
  }, [location.search, location.pathname])

  // --- Early Return ---
  if (!user) {
    return <GlobalLoader />
  }

  return (
    <>
      <div className="m-auto flex max-w-4xl flex-col gap-4 p-5">
        <p className="flex items-center gap-2 font-semibold">
          <LampDesk className="size-4.5" />
          Welcome to Luua — pick a feature to begin.
        </p>

        <FeaturesGrid />
      </div>

      {/** Modal Payments Confirmation, Open When User Make payment */}
      {isProWelcomeBannerOpen && (
        <ProWelcomeBanner
          open={isProWelcomeBannerOpen}
          onOpenChange={setIsProWelcomeBannerOpen}
        />
      )}
    </>
  )
}

//--- Lazy Route ---
export const Route = createLazyRoute('/welcome')({
  component: Welcome,
})

export default Welcome

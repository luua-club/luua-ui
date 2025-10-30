import { createLazyRoute, useLocation } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { removeQueryParams } from '@/core/utils/common.util'

import ProWelcomeBanner from './components/pro-welcome-banner'

function Welcome() {
  // --- States ---
  const [isProWelcomeBannerOpen, setIsProWelcomeBannerOpen] = useState(false)

  // --- Hooks ---
  const location = useLocation()

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

  return (
    <>
      <div className="m-auto max-w-4xl p-5">
        <h1>Welcome Page</h1>
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

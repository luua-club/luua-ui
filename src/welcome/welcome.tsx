import { createLazyRoute, useLocation } from '@tanstack/react-router'
import { LampDesk, Lightbulb } from 'lucide-react'
import { useEffect, useState } from 'react'

import { EXTERNAL_URLS } from '@/core/config/constant'
import { useAppDispatch } from '@/core/hooks/global-state.hook'
import { useUserState } from '@/core/hooks/user-state.hook'
import {
  clearNavbarRightComponent,
  setNavbarRightComponent,
} from '@/core/store/navbar-slice'
import { removeQueryParams } from '@/core/utils/common.util'
import GlobalLoader from '@/shared/components/global-loader'
import { Button } from '@/shared/ui/button'
import { HeroVideoDialog } from '@/shared/ui/hero-video-dialog'
import FeaturesGrid from '@/welcome/components/features-grid'

import ProWelcomeBanner from './components/pro-welcome-banner'

function Welcome() {
  // --- States ---
  const [isProWelcomeBannerOpen, setIsProWelcomeBannerOpen] = useState(false)

  // --- Hooks ---
  const location = useLocation()
  const user = useUserState()
  const dispatch = useAppDispatch()

  //--- Effects ---
  /**
   * Check for welcome and pro query parameters and open drawers.
   */
  useEffect(() => {
    // query parameters
    const params = new URLSearchParams(location.search)
    const pro = Boolean(params.get('pro'))

    // query parameters - Pro
    if (pro) {
      setIsProWelcomeBannerOpen(true)
      removeQueryParams(params, ['pro'])
    }
  }, [location.search, location.pathname])

  /**
   * Set navbar right component on mount, clear on unmount
   */
  useEffect(() => {
    dispatch(setNavbarRightComponent('welcome'))

    return () => {
      dispatch(clearNavbarRightComponent())
    }
  }, [dispatch])

  // --- Early Return ---
  if (!user) {
    return <GlobalLoader />
  }

  return (
    <>
      {/** Main Content */}
      <div className="m-auto flex max-w-4xl flex-col gap-3 p-5">
        {/** Header */}
        <div className="my-4 flex flex-col items-center justify-between gap-4 text-center md:my-0 md:flex-row md:items-end md:gap-2 md:text-start">
          {/** Title */}
          <p className="flex items-center gap-3 text-xl font-semibold text-balance">
            <LampDesk className="hidden size-6 md:block" /> Welcome. What’s the
            focus today?
          </p>

          {/** Video */}
          <HeroVideoDialog videoSrc={EXTERNAL_URLS.youtube_main_video}>
            <Button size="sm" className="text-xs">
              <Lightbulb className="size-3.5" /> How it works ?
            </Button>
          </HeroVideoDialog>
        </div>

        {/** Bento Grid */}
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

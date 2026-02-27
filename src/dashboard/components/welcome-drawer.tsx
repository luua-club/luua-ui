import { LampDeskIcon, Lightbulb, Telescope, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { EXTERNAL_URLS, LUUA_USER_KEY } from '@/core/config/constant'
import { LoginResponse } from '@/core/models/auth.model'
import { removeQueryParams } from '@/core/utils/common.util'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { Button } from '@/shared/ui/button'
import { Drawer, DrawerContent } from '@/shared/ui/drawer'
import { HeroVideoDialog } from '@/shared/ui/hero-video-dialog'
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@/shared/utils/localstorage.util'

import FeaturesGrid from './features-grid'
import ProWelcomeBanner from './pro-welcome-banner'

const LUUA_WELCOME_SHOWN = 'LUUA_WELCOME_SHOWN'

function WelcomeDrawer() {
  // --- States ---
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false)
  const [isProBannerOpen, setIsProBannerOpen] = useState(false)

  // --- Hooks ---
  const isMobile = useIsMobile()

  // --- Effects ---
  useEffect(() => {
    const authData = getLocalStorageItem<LoginResponse>(LUUA_USER_KEY)
    const alreadyShown = getLocalStorageItem<boolean>(LUUA_WELCOME_SHOWN)
    if (authData?.new_user === true && !alreadyShown) {
      setLocalStorageItem(LUUA_WELCOME_SHOWN, true)
      setIsWelcomeOpen(true)
    }

    const params = new URLSearchParams(window.location.search)
    if (params.get('pro')) {
      setIsProBannerOpen(true)
      removeQueryParams(params, ['pro'])
    }
  }, [])

  return (
    <>
      {/** Floating Button to render */}
      <Button
        variant={'outline'}
        size={'sm'}
        className="text-primary/80 absolute top-4 right-4 rounded-full text-xs"
        onClick={() => setIsWelcomeOpen(true)}
      >
        <Telescope /> Explore
      </Button>

      {/** Drawer content that opens on clicking floating btn */}
      <Drawer
        direction="right"
        open={isWelcomeOpen}
        onOpenChange={setIsWelcomeOpen}
      >
        <DrawerContent
          className="bg-secondary overflow-x-hidden overflow-y-auto"
          style={{ maxWidth: isMobile ? '100%' : '70vw' }}
        >
          <div className="!bg-primary-foreground mb-6 flex items-center justify-between gap-3 px-4 py-4 shadow">
            <h2 className="flex min-w-0 flex-1 items-center gap-2 truncate text-sm font-semibold sm:text-base">
              <LampDeskIcon className="size-4 shrink-0" />
              <span className="truncate">What do you want to do today ?</span>
            </h2>

            <div className="flex gap-4">
              {/** Video */}
              <HeroVideoDialog videoSrc={EXTERNAL_URLS.youtube_main_video}>
                <Button size="sm" className="text-xs">
                  <Lightbulb className="size-3.5" /> How it works ?
                </Button>
              </HeroVideoDialog>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsWelcomeOpen(false)}
                className="!px-1.5 shadow"
              >
                <X className="size-5" />
              </Button>
            </div>
          </div>

          <div className="px-2 pb-6">
            <FeaturesGrid />
          </div>
        </DrawerContent>
      </Drawer>

      {/** If User upgraded to pro plan then show pro banner */}
      {isProBannerOpen && (
        <ProWelcomeBanner
          open={isProBannerOpen}
          onOpenChange={setIsProBannerOpen}
        />
      )}
    </>
  )
}

export default WelcomeDrawer

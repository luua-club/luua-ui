import { Gauge, LampDeskIcon, Lightbulb, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { LUUA_USER_KEY } from '@/core/config/constant'
import { LoginResponse } from '@/core/models/auth.model'
import { removeQueryParams } from '@/core/utils/common.util'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { Button } from '@/shared/ui/button'
import { Drawer, DrawerContent } from '@/shared/ui/drawer'
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@/shared/utils/localstorage.util'

import FeaturesGrid from './features-grid'
import ProWelcomeBanner from './pro-welcome-banner'

const LUUA_WELCOME_SHOWN = 'LUUA_WELCOME_SHOWN'

function WelcomeDrawer() {
  const isMobile = useIsMobile()
  // --- States ---
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false)
  const [isProBannerOpen, setIsProBannerOpen] = useState(false)

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
      <Button
        variant={'outline'}
        size={'sm'}
        className="text-primary/80 absolute top-4 right-4 size-10 rounded-full text-lg"
        onClick={() => setIsWelcomeOpen(true)}
      >
        ?
      </Button>

      <Drawer
        direction="right"
        open={isWelcomeOpen}
        onOpenChange={setIsWelcomeOpen}
      >
        <DrawerContent
          className="overflow-x-hidden overflow-y-auto"
          style={{ maxWidth: isMobile ? '100%' : '70vw' }}
        >
          <div className="bg-secondary mb-6 flex items-center justify-between gap-3 border-b px-4 py-4">
            <h2 className="flex min-w-0 flex-1 items-center gap-2 truncate text-sm font-semibold sm:text-base">
              <LampDeskIcon className="size-4 shrink-0" />
              <span className="truncate">
                Welcome. What&apos;s the focus today?
              </span>
            </h2>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="hidden gap-2 text-xs sm:flex"
                onClick={() => setIsWelcomeOpen(false)}
              >
                <Gauge className="size-3.5" />
                My Dashboard
              </Button>

              <Button
                size="sm"
                className="hidden gap-2 text-xs sm:flex"
                onClick={() => setIsWelcomeOpen(false)}
              >
                <Lightbulb className="size-3.5" />
                How it works?
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsWelcomeOpen(false)}
                className="!px-1.5"
              >
                <X className="size-5" />
              </Button>
            </div>
          </div>

          <div className="px-6 pb-6">
            <FeaturesGrid />
          </div>
        </DrawerContent>
      </Drawer>

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

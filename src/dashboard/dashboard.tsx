import { createLazyRoute, useLocation, useRouter } from '@tanstack/react-router'
import { Loader } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

import Logo from '@/assets/images/luua-black-icon.svg?react'
import LogoDark from '@/assets/images/luua-white-icon.svg?react'
import { PromptInput } from '@/core/components/PromptInput'
import { useAppDispatch } from '@/core/hooks/global-state.hook'
import { useUserState } from '@/core/hooks/user-state.hook'
import { channelType } from '@/core/models/social.model'
import { setPrompt } from '@/core/store/prompt-slice'
import { removeQueryParams } from '@/core/utils/common.util'
import { ProPlanChip } from '@/shared/components/pro-plan-chip'
import { UpgradePlanBtn } from '@/shared/components/upgrade-plan-btn'
import { capitalize } from '@/shared/utils'

import ProWelcomeBanner from './components/pro-welcome-banner'
import WelcomeBanner from './components/welcome-banner'

function Dashboard() {
  //--- States ---
  const [isWelcomeBannerOpen, setIsWelcomeBannerOpen] = useState(false)
  const [isProWelcomeBannerOpen, setIsProWelcomeBannerOpen] = useState(false)

  //--- Hooks ---
  const dispatch = useAppDispatch()
  const userState = useUserState()
  const router = useRouter()
  const location = useLocation()

  //--- Handlers ---
  /**
   * Handle user prompt, update state and navigate to creation page
   * Used by creation page to initiate generate post API calls.
   *
   * @param value - The user's input value
   * @param search - Whether the user is searching
   * @param channel - The channel the user is using
   */
  const handleUserPrompt = (
    value: string,
    search: boolean,
    channel: string | null
  ) => {
    dispatch(
      setPrompt({ prompt: value, search, channel: channel as channelType })
    )

    router.navigate({ to: '/creation/create' })
  }

  //--- Effects ---
  /**
   * Check for welcome and pro query parameters and open drawers.
   */
  useEffect(() => {
    // query parameters
    const params = new URLSearchParams(location.search)
    const welcome = params.get('welcome')
    const pro = params.get('pro')

    // query parameters - Pro
    if (pro === 'true') {
      setIsProWelcomeBannerOpen(true)
      removeQueryParams(params, ['pro'])
    }

    if (welcome === 'true') {
      setIsWelcomeBannerOpen(true)
      removeQueryParams(params, ['welcome'])
    }
  }, [location.search, location.pathname])

  //--- Early Return, User Not Present/Loaded ---
  if (!userState) {
    return (
      <div className="relative min-h-[calc(100vh-3.5rem)]">
        <Loader className="absolute top-[40%] left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 animate-spin duration-75" />
      </div>
    )
  }

  //--- Computed Variables ---
  const isProPlan = userState.plan === 'Pro'

  //--- Render ---
  return (
    <div className="relative m-auto min-h-[calc(100vh-3.5rem)] max-w-7xl">
      <div className="absolute top-[40%] left-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 transform flex-col gap-6 p-5 lg:max-w-[60%]">
        {/** Floating Chip */}
        <div className="w-fit cursor-pointer self-center">
          {isProPlan ? (
            <ProPlanChip
              className="text-sm"
              onClick={() => setIsProWelcomeBannerOpen(true)}
            >
              Pro Plan
            </ProPlanChip>
          ) : (
            <UpgradePlanBtn
              onClick={() => router.navigate({ to: '/payments' })}
            />
          )}
        </div>

        {/** Welcome Message */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center gap-3 text-center font-serif text-3xl font-medium text-balance md:flex-row"
        >
          {/** Logo */}
          <span className="rounded-full border-1 border-dashed p-3 dark:border-none">
            <Logo className="size-7 dark:hidden" />
            <LogoDark className="hidden size-7 dark:block" />
          </span>

          {/** Text */}
          {userState?.name && (
            <span>
              Hi {capitalize(userState?.name.split(' ')[0] || '')}, how are you?
            </span>
          )}
        </motion.h1>

        {/** Main User Prompt Input */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
        >
          <PromptInput onChange={handleUserPrompt} />
        </motion.div>
      </div>

      {/** Modal Welcome, Open When User Logins First Time */}
      {isWelcomeBannerOpen && (
        <WelcomeBanner
          open={isWelcomeBannerOpen}
          onOpenChange={setIsWelcomeBannerOpen}
        />
      )}

      {/** Modal Payments Confirmation, Open When User Make payment */}
      {isProWelcomeBannerOpen && (
        <ProWelcomeBanner
          open={isProWelcomeBannerOpen}
          onOpenChange={setIsProWelcomeBannerOpen}
        />
      )}
    </div>
  )
}

//--- Lazy Route ---
export const Route = createLazyRoute('/dashboard')({
  component: Dashboard,
})
export default Dashboard

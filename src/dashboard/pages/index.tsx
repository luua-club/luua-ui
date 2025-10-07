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
import { ProPlanChip } from '@/shared/components/pro-plan-chip'
import { UpgradePlanBtn } from '@/shared/components/upgrade-plan-btn'
import { capitalize } from '@/shared/utils'

import ProWelcomeBanner from '../components/ProWelcomeBanner'
import WelcomeBanner from '../components/WelcomeBanner'

const Dashboard = () => {
  const dispatch = useAppDispatch()
  const userState = useUserState()
  const router = useRouter()
  const location = useLocation()
  const [isWelcomeBannerOpen, setIsWelcomeBannerOpen] = useState(false)
  const [isProWelcomeBannerOpen, setIsProWelcomeBannerOpen] = useState(false)

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

  // Check for welcome query parameter and open banner
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const welcome = params.get('welcome')
    const pro = params.get('pro')

    if (pro === 'true') {
      setIsProWelcomeBannerOpen(true)
      params.delete('pro')
      const newSearch = params.toString()
      if (newSearch) {
        window.history.replaceState(
          null,
          '',
          `${location.pathname}?${newSearch}`
        )
      } else {
        window.history.replaceState(null, '', location.pathname)
      }
      return
    }

    if (welcome === 'true') {
      setIsWelcomeBannerOpen(true)
      params.delete('welcome')
      const newSearch = params.toString()
      if (newSearch) {
        window.history.replaceState(
          null,
          '',
          `${location.pathname}?${newSearch}`
        )
      } else {
        window.history.replaceState(null, '', location.pathname)
      }
    }
  }, [location.search, location.pathname])

  if (!userState) {
    return (
      <div className="relative min-h-[calc(100vh-3.5rem)]">
        <Loader className="absolute top-[40%] left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 animate-spin duration-75" />
      </div>
    )
  }

  const isProPlan = userState.plan === 'Pro'

  return (
    <div className="relative m-auto min-h-[calc(100vh-3.5rem)] max-w-7xl">
      <div className="absolute top-[40%] left-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 transform flex-col gap-6 p-5 lg:max-w-[60%]">
        <div className="w-fit cursor-pointer self-center">
          {/** TODO: Open modal for Pro Plan */}
          {isProPlan ? (
            <ProPlanChip className="text-sm">Pro Plan</ProPlanChip>
          ) : (
            <UpgradePlanBtn
              onClick={() => router.navigate({ to: '/payments' })}
            />
          )}
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center gap-3 text-center font-serif text-3xl font-medium text-balance md:flex-row"
        >
          <span className="rounded-full border-1 border-dashed p-3 dark:border-none">
            <Logo className="size-7 dark:hidden" />
            <LogoDark className="hidden size-7 dark:block" />
          </span>
          {userState?.name && (
            <span>
              Hi {capitalize(userState?.name.split(' ')[0] || '')}, how are you?
              thank i
            </span>
          )}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
        >
          <PromptInput onChange={handleUserPrompt} />
        </motion.div>
      </div>

      {isWelcomeBannerOpen && (
        <WelcomeBanner
          open={isWelcomeBannerOpen}
          onOpenChange={setIsWelcomeBannerOpen}
        />
      )}

      {isProWelcomeBannerOpen && (
        <ProWelcomeBanner
          open={isProWelcomeBannerOpen}
          onOpenChange={setIsProWelcomeBannerOpen}
        />
      )}
    </div>
  )
}

export const Route = createLazyRoute('/dashboard')({
  component: Dashboard,
})

export default Dashboard

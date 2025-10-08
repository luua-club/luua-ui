import { useRouter } from '@tanstack/react-router'
import { Box, Download, PencilRuler, PlugZap } from 'lucide-react'
import { useEffect, useMemo } from 'react'

import { showConfetti } from '@/core/utils/common.util'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils'

import { IntroStep } from '../models/intro-step.model'
import IntroDisclosure from './intro-disclosure'

interface WelcomeBannerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function WelcomeBanner({ open, onOpenChange }: WelcomeBannerProps) {
  //--- Hooks ---
  const router = useRouter()

  //--- Variables ---
  const stepsData: IntroStep[] = useMemo(
    () => [
      {
        title: 'Your Personal Ghostwriter',
        description: 'Create, Schedule And Publish Posts',
        longDescription:
          'Luua uses GenAI to create engaging posts for you, with easy scheduling and publishing across platforms, all in one place.',
        image: (
          <img
            src="/images/create.webp"
            width={500}
            height={500}
            alt="create"
            className={cn(
              'absolute rounded-2xl object-contain filter',
              `-right-4`,
              `-bottom-[82%]`,
              `lg:-right-[35%]`
            )}
          />
        ),
        color: 'bg-blue-800',
        customAction: (
          <Badge className="dark:bg-primary-foreground dark:text-primary mt-4 px-3 py-2 text-sm">
            <PencilRuler className="size-4" /> Try Now
          </Badge>
        ),
      },
      {
        title: 'Your Brand On Auto Pilot',
        description: 'Automatically Generate Posts For You',
        longDescription:
          'Auto Pilot uses your bookmarked inspirations and style to auto-generate fresh, on-brand posts so you never run dry.',
        image: (
          <img
            src="/images/autogen.webp"
            width={500}
            height={500}
            alt="autoGen"
            className={cn(
              'absolute rounded-2xl object-contain filter',
              `-right-4`,
              `-bottom-[5%]`,
              `lg:-right-[35%]`
            )}
          />
        ),
        color: 'bg-black',
        customAction: (
          <Badge className="bg-primary text-primary-foreground mt-4 px-3 py-2 text-sm">
            <Download className="size-4" /> Download Chrome Extension
          </Badge>
        ),
      },
      {
        title: 'Power Up With Pro',
        description: 'Unlock Advanced Features & Remove Limits',
        longDescription:
          'Pro make Unlimited Scheduling, Unlimited AutoGen Posts, Enhanced User Styles, Unlocks Twitter/X and much more.',
        image: (
          <img
            src="/images/summary.webp"
            width={500}
            height={500}
            alt="summary"
            className={cn(
              'absolute rounded-2xl object-contain filter',
              `-right-4`,
              `-bottom-[35%]`,
              `lg:-right-[35%]`
            )}
          />
        ),
        color: 'bg-yellow-800',
        customAction: (
          <Button
            className="dark:bg-primary-foreground dark:text-primary z-50 mt-4 w-fit text-sm"
            onClick={() => router.navigate({ to: '/payments' })}
          >
            <Box className="size-4" /> Go Pro
          </Button>
        ),
      },
      {
        title: 'Connect With Your Audience',
        description: 'One Time Connection To Your Social Accounts',
        longDescription:
          "To generate AI content and publish posts, you'll need to connect at least one social account with Luua.",
        image: (
          <img
            src="/images/social.webp"
            width={500}
            height={500}
            alt="Socials"
            className={cn(
              'absolute rounded-2xl object-contain filter',
              `-right-4`,
              `-bottom-[32%]`,
              `lg:-right-[35%]`
            )}
          />
        ),
        color: 'bg-green-800',
        customAction: (
          <Button
            className="dark:bg-destructive z-50 mt-4 w-fit border-none text-sm dark:text-white"
            onClick={() =>
              router.navigate({ to: '/settings', search: { tabs: 'socials' } })
            }
          >
            <PlugZap className="size-4" /> Connect
          </Button>
        ),
      },
    ],
    [router]
  )

  // --- Effects ---
  /**
   * Runs a confetti animation when the component is mounted
   */
  useEffect(() => {
    showConfetti()
  }, [])

  return (
    <IntroDisclosure
      title="Welcome to Luua"
      stepsData={stepsData}
      open={open}
      onOpenChange={onOpenChange}
    />
  )
}

export default WelcomeBanner

import { useRouter } from '@tanstack/react-router'
import { Calendar, HardDriveUpload, Network, PlugZap } from 'lucide-react'

import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils'

import IntroDisclosure from '../../shared/components/intro-disclosure'
import { IntroStep } from '../../shared/models/intro-step.model'

interface ProWelcomeBannerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function ProWelcomeBanner({ open, onOpenChange }: ProWelcomeBannerProps) {
  //--- Hooks ---
  const router = useRouter()

  //--- Variables ---
  const stepsData: IntroStep[] = [
    {
      title: 'Power Unlocked',
      description: 'Unlimited Scheduling, More AI Credits',
      longDescription:
        'Enjoy unlimited post scheduling and 1000 AI credits each month, giving you freedom to plan ahead and generate advanced content.',
      color: 'bg-green-800',
      image: (
        <img
          src="/images/schedule.webp"
          width={500}
          height={500}
          alt="schedule"
          className={cn(
            'absolute rounded-2xl object-contain filter',
            `-right-4`,
            `-bottom-[25%]`,
            `lg:-right-[35%]`
          )}
        />
      ),
      customAction: (
        <Badge className="dark:bg-primary-foreground dark:text-primary mt-4 px-3 py-2 text-sm">
          <Calendar className="size-4" /> Schedule Posts
        </Badge>
      ),
    },
    {
      title: 'Unlimited Autopilot',
      description: 'Run Autopilot Without Any Limits',
      longDescription:
        'Generate as many automated posts as you want with Luua Autopilot, ensuring your content calendar never runs empty.',
      color: 'bg-purple-800',
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
      customAction: (
        <Badge className="dark:bg-primary-foreground dark:text-primary mt-4 px-3 py-2 text-sm">
          <Network className="size-4" /> Add Inspiration
        </Badge>
      ),
    },

    {
      title: 'Advanced Style Control',
      description: 'Enhanced User Styles is Unlocked',
      longDescription:
        'Customize post styles and formats in detail with advanced configuration, ensuring every post matches your unique brand voice.',
      color: 'bg-red-800',
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
      customAction: (
        <Badge className="dark:bg-primary-foreground dark:text-primary mt-4 px-3 py-2 text-sm">
          <HardDriveUpload className="size-4" /> Upload File or Text
        </Badge>
      ),
    },
    {
      title: 'Multi-Platform Reach',
      description: 'Twitter/ X is Unlocked, All Socials in One Place',
      longDescription:
        'Expand your reach by publishing directly to Twitter also, managing all channels seamlessly from one platform.',
      color: 'bg-black',
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
  ]

  return (
    <IntroDisclosure
      title="You Just Unlocked Your Potential"
      stepsData={stepsData}
      open={open}
      onOpenChange={onOpenChange}
    />
  )
}

export default ProWelcomeBanner

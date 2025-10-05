import { useRouter } from '@tanstack/react-router'
import { Box, Download, PencilRuler, PlugZap } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'

import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/ui/drawer'
import { Progress } from '@/shared/ui/progress'
import { Separator } from '@/shared/ui/separator'
import { WobbleCard } from '@/shared/ui/wobble-card'
import { cn } from '@/shared/utils'

interface WelcomeBannerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface Step {
  title: string
  description: string
  image?: React.ReactNode
  color?: string
  customAction?: React.ReactNode
  longDescription: string
}

function WelcomeBanner({ open, onOpenChange }: WelcomeBannerProps) {
  const [activeStep, setActiveStep] = useState(0)
  const router = useRouter()

  const stepsData: Step[] = useMemo(
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
          <Button
            className="dark:bg-primary-foreground dark:text-primary z-50 mt-4 w-fit text-sm"
            onClick={() => router.navigate({ to: '/creation/create' })}
          >
            <PencilRuler /> Try Now
          </Button>
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
            alt="autogen"
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
          <Button
            className="dark:bg-primary-foreground dark:text-primary z-50 mt-4 w-fit text-sm"
            variant={'secondary'}
          >
            <Download /> Download Chrome Extension
          </Button>
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
            <Box /> Go Pro
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
            className="dark:bg-primary-foreground dark:text-primary z-50 mt-4 w-fit text-sm"
            onClick={() =>
              router.navigate({ to: '/settings', search: { tabs: 'socials' } })
            }
          >
            <PlugZap /> Connect
          </Button>
        ),
      },
    ],
    [router]
  )

  const totalSteps = stepsData.length
  const checkedCount = activeStep + 1
  const progress = (checkedCount / totalSteps) * 100

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <div />
      </DrawerTrigger>
      <DrawerContent className="!h-[90vh] !max-h-[90vh] focus:!outline-none">
        <div className="mx-auto w-full flex-1 overflow-y-auto px-2 sm:max-w-xl lg:max-w-2xl">
          {/** Progress Bar */}
          <DrawerHeader className="space-y-4 px-2">
            <Progress value={progress} className="mb-4" />
            <DrawerTitle className="text-left text-lg font-semibold">
              Welcome to Luua
            </DrawerTitle>
          </DrawerHeader>

          {/** Steps Chips */}
          <div className="-mt-1 grid grid-cols-2 sm:gap-4 sm:p-2">
            {stepsData.map((step, index) => (
              <Step
                key={step.title}
                title={step.title}
                description={step.description}
                active={index === activeStep}
                isChecked={index <= activeStep}
                onClick={() => setActiveStep(index)}
              />
            ))}
          </div>

          {/** Step Content */}
          <WobbleCard
            containerClassName={`${stepsData[activeStep]?.color} mt-4 p-2`}
          >
            <div className="flex max-w-xs flex-col justify-between">
              <h2 className="text-left text-base font-semibold tracking-[-0.015em] text-balance text-white lg:text-2xl">
                {stepsData[activeStep]?.description}
              </h2>
              <p className="mt-4 text-left text-sm font-medium text-balance text-neutral-200">
                {stepsData[activeStep]?.longDescription}
              </p>
              {stepsData[activeStep]?.customAction}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                className="hidden lg:block"
                key={activeStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.35,
                  delay: 0.08,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                {stepsData[activeStep]?.image}
              </motion.div>
            </AnimatePresence>
          </WobbleCard>
        </div>

        {/** Footer */}
        <Separator />
        <DrawerFooter className="flex flex-row justify-between">
          <div className="flex flex-row gap-2">
            <Button
              className="w-fit"
              variant="link"
              onClick={() => onOpenChange?.(false)}
            >
              Skip All
            </Button>
            <Button
              className="w-fit"
              variant="outline"
              onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
            >
              Prev
            </Button>
          </div>
          <Button
            className="w-fit"
            onClick={() => {
              if (activeStep === totalSteps - 1) {
                onOpenChange?.(false)
              } else {
                setActiveStep(prev => Math.min(totalSteps - 1, prev + 1))
              }
            }}
          >
            {activeStep === totalSteps - 1 ? 'Complete' : 'Next'}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

interface StepProps {
  title: string
  description: string
  active: boolean
  isChecked: boolean
  onClick: () => void
}

const Step = ({
  title,
  description,
  active,
  isChecked,
  onClick,
}: StepProps) => {
  return (
    <div
      className={cn(
        'hover:bg-muted cursor-pointer space-y-2 rounded-lg border border-transparent p-2 transition-all duration-200 sm:px-4 sm:py-3',
        active && 'border-border bg-muted'
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-balance sm:text-sm dark:font-light">
          {title}
        </p>
        {isChecked && (
          <Checkbox
            className="hidden size-4 rounded-full sm:block"
            checked={true}
          />
        )}
      </div>
      <p className="text-muted-foreground text-xs font-light text-balance dark:font-extralight">
        {description}
      </p>
    </div>
  )
}

export default WelcomeBanner

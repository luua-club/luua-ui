import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

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
import { cn, showConfetti } from '@/shared/utils'

import { IntroStep } from '../models/intro-step.model'

interface IntroDisclosureProps {
  title: string
  stepsData: IntroStep[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

function IntroDisclosure(props: IntroDisclosureProps) {
  // ---- States ----
  const [activeStep, setActiveStep] = useState(0)

  // ---- Computed Variables ----
  const totalSteps = props.stepsData.length
  const checkedCount = activeStep + 1
  const progress = (checkedCount / totalSteps) * 100

  // ---- Effects ----
  /**
   * Show confetti when drawer opens
   */
  useEffect(() => {
    if (props.open) {
      showConfetti()
    }
  }, [props.open])

  return (
    <Drawer open={props.open} onOpenChange={props.onOpenChange}>
      {/** Trigger Automatic */}
      <DrawerTrigger asChild>
        <div />
      </DrawerTrigger>

      {/** Content */}
      <DrawerContent className="!h-[90vh] !max-h-[90vh] focus:!outline-none">
        <div className="mx-auto w-full flex-1 overflow-y-auto px-2 sm:max-w-xl lg:max-w-2xl">
          {/** Progress Bar */}
          <DrawerHeader className="space-y-4 px-2">
            <Progress value={progress} className="mb-4" />
            <DrawerTitle className="text-left text-lg font-semibold">
              {props.title}
            </DrawerTitle>
          </DrawerHeader>

          {/** Steps Chips */}
          <div className="-mt-1 grid grid-cols-2 sm:gap-4 sm:p-2">
            {props.stepsData.map((step, index) => (
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
            containerClassName={`${props.stepsData[activeStep]?.color} mt-4 p-2`}
          >
            {/** Left Side */}
            <div className="flex max-w-xs flex-col justify-between">
              <h2 className="text-left text-base font-semibold tracking-[-0.015em] text-balance text-white lg:text-2xl">
                {props.stepsData[activeStep]?.description}
              </h2>
              <p className="mt-4 text-left text-sm font-medium text-balance text-neutral-200">
                {props.stepsData[activeStep]?.longDescription}
              </p>
              {props.stepsData[activeStep]?.customAction}
            </div>

            {/** Right Side */}
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
                {props.stepsData[activeStep]?.image}
              </motion.div>
            </AnimatePresence>
          </WobbleCard>
        </div>

        {/** Footer */}
        <Separator />
        <DrawerFooter className="flex flex-row justify-between">
          {/** Left Side Buttons */}
          <div className="flex flex-row gap-2">
            {/** Skip All */}
            <Button
              className="w-fit"
              variant="link"
              onClick={() => {
                props.onOpenChange(false)
              }}
            >
              Skip All
            </Button>

            {/** Prev */}
            <Button
              className="w-fit"
              variant="outline"
              onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
            >
              Prev
            </Button>
          </div>

          {/** Right Side Button - Next or Complete */}
          <Button
            className="w-fit"
            onClick={() => {
              if (activeStep === totalSteps - 1) {
                props.onOpenChange(false)
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

/**
 * Step component
 */
interface StepProps {
  title: string
  description: string
  active: boolean
  isChecked: boolean
  onClick: () => void
}
const Step = (props: StepProps) => {
  return (
    <div
      className={cn(
        'hover:bg-muted cursor-pointer space-y-2 rounded-lg border border-transparent p-2 transition-all duration-200 sm:px-4 sm:py-3',
        props.active && 'border-border bg-muted'
      )}
      onClick={props.onClick}
    >
      <div className="flex items-center justify-between">
        {/** Title */}
        <p className="text-sm font-medium text-balance sm:text-sm dark:font-light">
          {props.title}
        </p>

        {/** Checkbox */}
        {props.isChecked && (
          <Checkbox
            className="hidden size-4 rounded-full sm:block"
            checked={true}
          />
        )}
      </div>

      {/** Description */}
      <p className="text-muted-foreground text-xs font-light text-balance dark:font-extralight">
        {props.description}
      </p>
    </div>
  )
}

export default IntroDisclosure

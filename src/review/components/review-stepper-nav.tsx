import ChipBadge from '@/shared/components/chip-badge'
import {
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/shared/ui/stepper'
import { cn } from '@/shared/utils'

import { Step } from '../constant'

interface ReviewStepperNavProps {
  steps: Step[]
  loadingStep?: string
}

export function ReviewStepperNav({
  steps,
  loadingStep,
}: ReviewStepperNavProps) {
  return (
    <StepperNav className="mb-10 gap-3">
      {steps.map((step, index) => {
        return (
          <StepperItem
            key={index}
            step={index + 1}
            className="relative flex-1 items-start"
            loading={step.id === loadingStep}
          >
            <StepperTrigger
              className="flex grow flex-col items-start justify-center gap-2.5"
              asChild
            >
              <StepperIndicator
                className={cn(
                  'data-[state=inactive]:border-border data-[state=inactive]:text-muted-foreground size-8 border-2 data-[state=completed]:bg-green-500 data-[state=completed]:text-white data-[state=inactive]:bg-transparent'
                )}
              >
                <step.icon className="size-4" />
              </StepperIndicator>

              <div className="flex flex-col items-start gap-1">
                <div className="text-muted-foreground text-[10px] font-semibold uppercase">
                  Step {index + 1}
                </div>

                <StepperTitle className="group-data-[state=inactive]/step:text-muted-foreground text-start text-base font-semibold">
                  {step.title}
                </StepperTitle>

                <div>
                  <ChipBadge
                    variant="hot"
                    className="hidden group-data-[state=active]/step:inline-flex"
                  >
                    In Progress
                  </ChipBadge>

                  <ChipBadge
                    variant="nature"
                    className="hidden group-data-[state=completed]/step:inline-flex"
                  >
                    Completed
                  </ChipBadge>

                  <ChipBadge
                    variant="stale"
                    className="hidden group-data-[state=inactive]/step:inline-flex"
                  >
                    Pending
                  </ChipBadge>
                </div>
              </div>
            </StepperTrigger>

            {steps.length > index + 1 && (
              <StepperSeparator className="absolute inset-x-0 start-9 top-4 m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none group-data-[state=completed]/step:bg-green-500" />
            )}
          </StepperItem>
        )
      })}
    </StepperNav>
  )
}

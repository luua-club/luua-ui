import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

import {
  GOALS,
  INDUSTRIES,
  ONBOARDING_FORM_SCHEMA,
  OnboardingFormValues,
} from '@/auth/config/onboarding.config'
import UserStyles from '@/core/containers/UserStylesChips'
import { Button } from '@/shared/ui/button'
import { Form } from '@/shared/ui/form'
import { Progress } from '@/shared/ui/progress'

import Goal from '../components/on-boarding/Goal'
import RoleAndIndustry from '../components/on-boarding/RolesAndIndustry'

function OnBoarding() {
  // ---- State ----
  const [currentStep, setCurrentStep] = useState(1)

  // ---- Variables ----
  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100
  const steps = ['Role & Industry', 'Goal', 'Styles']

  // ---- Hooks ----
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(ONBOARDING_FORM_SCHEMA),
    mode: 'onTouched',
    defaultValues: {
      role: '',
      industry: undefined,
      goal: undefined,
    },
  })

  // ---- Functions ----
  /**
   * Handles the next step
   */
  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) setCurrentStep(s => s + 1)
  }, [currentStep, totalSteps])

  /**
   * Handles the previous step
   */
  const prevStep = useCallback(() => {
    if (currentStep > 1) setCurrentStep(s => s - 1)
  }, [currentStep])

  /**
   * TODO: Handles the form submission
   */
  const onSubmit = useCallback((values: OnboardingFormValues) => {
    console.log('Onboarding submission:', values)
  }, [])

  /**
   * Returns the current step content
   */
  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return <RoleAndIndustry industries={INDUSTRIES} />
      case 2:
        return <Goal goals={GOALS} />
      case 3:
        return <UserStyles oneCol />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-0.5">
      <div
        className="flex w-full justify-center self-start"
        style={{
          all: 'revert',
          display: 'flex',
          justifyContent: 'center',
          alignSelf: 'flex-start',
          paddingTop: '1.5rem',
          width: '100%',
          lineHeight: '1.5',
          letterSpacing: 'normal',
          fontSize: '14px',
        }}
      >
        <div className="flex w-full flex-col gap-4 space-y-2">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-muted-foreground">
                {steps[currentStep - 1]}
              </span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Step Content */}
              {getStepContent()}

              {/* Actions Buttons */}
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button type="button" size="sm" onClick={nextStep}>
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" size="sm">
                    Complete
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default OnBoarding

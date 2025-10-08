import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { createLazyRoute, useRouter } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, PencilRuler } from 'lucide-react'
import { motion } from 'motion/react'
import posthog from 'posthog-js'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import Logo from '@/assets/images/luua-black-icon.svg?react'
import LogoDark from '@/assets/images/luua-white-icon.svg?react'
import { userApi } from '@/core/api/user.api'
import { LUUA_USER_KEY } from '@/core/config/constant'
import UserStyles from '@/core/containers/UserStyles'
import { LoginResponse } from '@/core/models/auth.model'
import {
  IUserStyleRequest,
  UserOnboardingRequest,
} from '@/core/models/user.model'
import { Button } from '@/shared/ui/button'
import { DotPattern } from '@/shared/ui/dot-pattern'
import { Form } from '@/shared/ui/form'
import { Progress } from '@/shared/ui/progress'
import { cn } from '@/shared/utils'
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@/shared/utils/localstorage.util'

import Goal from './components/goals'
import RoleAndIndustry from './components/role-industry'
import { GOALS, INDUSTRIES } from './config/constant'
import {
  ONBOARDING_FORM_SCHEMA,
  OnboardingFormValues,
} from './models/forms.model'

function OnBoarding() {
  // ---- State ----
  const [currentStep, setCurrentStep] = useState(1)
  const [styles, setStyles] = useState<string[]>([])

  // ---- Variables ----
  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100
  const steps = ['Role & Industry', 'Goal', 'Styles']

  // ---- Hooks ----
  const router = useRouter()
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(ONBOARDING_FORM_SCHEMA),
    mode: 'onTouched',
    defaultValues: {
      role: '',
      industry: undefined,
      goal: undefined,
    },
  })

  const setUserStyleMutation = useMutation({
    mutationFn: (payload: IUserStyleRequest) => userApi.setUserStyle(payload),
  })

  const userOnboardingMutation = useMutation({
    mutationFn: (payload: UserOnboardingRequest) => userApi.onboarding(payload),
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
   *  Handles the form submission
   */
  const onSubmit = async (values: OnboardingFormValues) => {
    try {
      const promises: Promise<unknown>[] = []
      promises.push(
        userOnboardingMutation.mutateAsync({
          role: values.role,
          industry: values.industry,
          goal: values.goal,
        })
      )
      if (styles.length > 0) {
        promises.push(
          setUserStyleMutation.mutateAsync({ writing_style: styles })
        )
      }

      if (promises.length > 0) {
        await Promise.all([...promises])
      }

      if (values.role || values.industry || values.goal) {
        posthog.capture('onboarding:completed', {
          role: values.role,
          industry: values.industry,
          goal: values.goal,
        })
      } else {
        posthog.capture('onboarding:skipped')
      }

      if (styles.length > 0) {
        posthog.capture('onboarding:styles_completed', {
          styles: styles,
        })
      } else {
        posthog.capture('onboarding:styles_skipped')
      }
    } catch {
      toast.error('Something Went Wrong')
    } finally {
      setLocalStorageItem(LUUA_USER_KEY, {
        ...getLocalStorageItem<LoginResponse>(LUUA_USER_KEY),
        new_user: false,
      })
      router.navigate({
        to: '/dashboard',
        search: { welcome: 'true' },
      })
    }
  }

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
        return (
          <UserStyles
            initialGridCol={2}
            customHeader={
              <div className="flex flex-col gap-2 pb-2">
                <h1 className="flex items-center gap-2 text-base font-semibold">
                  <PencilRuler className="size-5" /> How would you describe your
                  writing style?
                </h1>
                <p className="text-muted-foreground text-sm">
                  Choose the style that best fits your goal. The AI will adapt
                  its tone and structure accordingly.
                </p>
              </div>
            }
            onChange={setStyles}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen w-screen flex-col sm:items-center">
      <div className="absolute inset-0 flex w-full flex-col items-center justify-center overflow-hidden">
        <DotPattern
          glow={true}
          className={cn(
            '[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]'
          )}
        />
      </div>

      <div className="flex flex-col items-center justify-center gap-4 p-5 text-center sm:z-10">
        <span className="rounded-full border-2 border-dashed p-4">
          <Logo className="size-12 dark:hidden" />
          <LogoDark className="hidden size-12 dark:block" />
        </span>
        {/* Header */}
        <h1 className="text-xl font-semibold sm:text-3xl">
          Let&apos;s get you in the club!
        </h1>
        <p className="text-muted-foreground text-balance">
          Tell us a bit about you to personalize your content from day one.
        </p>
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
        className="sm:bg-card relative mt-4 flex w-full flex-col justify-center rounded-lg p-5 sm:w-fit sm:min-w-xl sm:border-1"
      >
        {/* Progress Bar */}
        <div className="mt-2 space-y-2">
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
        <div className="mt-8 min-h-1/2">
          <Form {...form}>
            <form className="flex flex-col gap-4">
              {/* Step Content */}
              <div>{getStepContent()}</div>

              {/* Buttons */}
              <div className="my-8 flex justify-between sm:mt-4 sm:mb-2">
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
                  <Button
                    type="button"
                    size="sm"
                    disabled={
                      setUserStyleMutation.isPending ||
                      userOnboardingMutation.isPending
                    }
                    onClick={() => onSubmit(form.getValues())}
                  >
                    {setUserStyleMutation.isPending ||
                    userOnboardingMutation.isPending
                      ? 'Saving...'
                      : 'Complete'}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </motion.div>
    </div>
  )
}

export const Route = createLazyRoute('/onboarding')({
  component: OnBoarding,
})

export default OnBoarding

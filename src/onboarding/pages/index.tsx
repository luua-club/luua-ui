import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { createLazyRoute, useRouter } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
  GOALS,
  INDUSTRIES,
  ONBOARDING_FORM_SCHEMA,
  OnboardingFormValues,
} from '@/auth/config/onboarding.config'
import { userApi } from '@/core/api/user.api'
import { LUUA_USER_KEY } from '@/core/config/constant'
import UserStyles from '@/core/containers/UserStyles'
import { LoginResponse } from '@/core/models/auth.model'
import { IUserStyleRequest } from '@/core/models/user.model'
import { BorderBeam } from '@/shared/ui/border-beam'
import { Button } from '@/shared/ui/button'
import { Form } from '@/shared/ui/form'
import { Progress } from '@/shared/ui/progress'
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@/shared/utils/localstorage.util'

import Goal from '../components/Goal'
import RoleAndIndustry from '../components/RolesAndIndustry'

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
      if (styles.length > 0) {
        await Promise.all([
          setUserStyleMutation.mutateAsync({ writing_style: styles }),
        ])
      }
      // TODO: call onboarding api call
    } catch {
      toast.error('Something Went Wrong')
    } finally {
      setLocalStorageItem(LUUA_USER_KEY, {
        ...getLocalStorageItem<LoginResponse>(LUUA_USER_KEY),
        new_user: false,
      })
      router.navigate({
        to: '/dashboard',
        search: { onboarding: 'true' },
        replace: true,
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
                <h1 className="text-lg font-medium">
                  How would you describe your writing style?
                </h1>
                <p className="text-muted-foreground text-base">
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
    <div className="h-screen w-screen">
      <div className="h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="absolute inset-0 mx-auto my-auto flex h-fit max-w-2xl flex-col justify-center p-5 sm:rounded-lg sm:border-1 sm:bg-white sm:shadow-lg">
        <BorderBeam
          duration={20}
          size={150}
          colorTo={'#0a0a0a'}
          colorFrom={'#0a0a0a'}
          borderWidth={2}
          className="hidden sm:block"
        />

        <h1 className="text-xl font-semibold sm:text-3xl">
          Let&apos;s get you in the Luua club!
        </h1>

        <div className="mt-4 space-y-2">
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

        <div className="mt-10 min-h-1/2">
          <Form {...form}>
            <form className="flex flex-col gap-4">
              <div>{getStepContent()}</div>

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
                    onClick={() => onSubmit(form.getValues())}
                  >
                    {setUserStyleMutation.isPending ? 'Saving...' : 'Complete'}
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

export const Route = createLazyRoute('/onboarding')({
  component: OnBoarding,
})

export default OnBoarding

import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { Check, Flame, Flower, Sprout, X } from 'lucide-react'
import posthog from 'posthog-js'
import { toast } from 'sonner'

import { paymentApi } from '@/core/api/payment.api'
import {
  postHogCheckoutCapture,
  postHogUpgradeCapture,
} from '@/core/config/posthog.config'
import { useUserState } from '@/core/hooks/user-state.hook'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'

function PlanCards() {
  // --- Hooks ---
  const user = useUserState()
  const router = useRouter()
  const createPaymentLinkMutation = useMutation({
    mutationFn: () => paymentApi.createPaymentLink(),
    onSuccess: ({ data }) => {
      const { payment_link } = data

      if (payment_link) {
        postHogCheckoutCapture(user?.plan)
        window.location.href = payment_link
        return
      }

      toast.error('Unable to open checkout link. Please try again later.')
    },
    onError: () => {
      posthog.captureException(createPaymentLinkMutation.error)
      toast.error('Failed to start checkout. Please try again.')
    },
  })

  // --- Variables ---
  const isProPlan = user?.plan === 'Pro'

  // --- Handlers ---
  /**
   * Handle upgrade click
   */
  const handleUpgradeClick = () => {
    postHogUpgradeCapture(user?.plan)
    createPaymentLinkMutation.mutate()
  }

  /**
   * Handle manage plan click
   */
  const handleManagePlanClick = () => {
    router.navigate({ to: '/settings', search: { tabs: 'billing' } })
  }

  return (
    <div className="my-2 grid gap-6 lg:grid-cols-2">
      {/* Free Plan */}
      <Card className="h-fit rounded-2xl border p-2 shadow-none">
        <CardHeader className="bg-secondary rounded-2xl p-5">
          <Card className="dark:bg-card-foreground dark:text-card w-fit rounded-md p-2">
            <Sprout />
          </Card>
          <CardTitle className="mt-4 text-2xl">Free Plan</CardTitle>
          <p className="mt-2">A simple way to explore</p>
          <p className="mt-2 text-4xl font-bold">
            $0
            <span className="text-muted-foreground ml-1 text-base font-normal">
              /month
            </span>
          </p>
          <Button variant="outline" className="mt-5 rounded-full">
            Basic Access
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 px-4">
          <h2 className="text-sm font-semibold">Operational Features</h2>
          <ul className="my-2 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Check className="size-4" />5 Autopilot actions per month
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4" />
              Schedule up to 5 posts per month
            </li>
            <li className="flex items-center gap-2">
              <X className="size-4" /> Advance Style Config not available
            </li>
            <li className="flex items-center gap-2">
              <X className="size-4" /> Twitter not available
            </li>
          </ul>

          <h2 className="mt-2 text-sm font-semibold">AI Generation</h2>
          <ul className="my-2 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Check className="size-4" />
              100 AI Generation credits per month
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4" />
              Basic AI Generation
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4" />
              Web Search
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Advanced Plan */}
      <Card className="bg-secondary h-fit rounded-2xl border p-2 shadow-none">
        <CardHeader className="bg-card rounded-2xl p-5 shadow">
          <div className="flex items-center justify-between gap-2">
            <Card className="dark:bg-secondary w-fit rounded-md p-2">
              <Flower />
            </Card>
            <Badge variant="destructive" className="rounded-full">
              {isProPlan ? (
                'Current Plan'
              ) : (
                <span className="flex items-center gap-1">
                  <Flame className="size-4" />
                  High Demand
                </span>
              )}
            </Badge>
          </div>
          <CardTitle className="mt-4 text-2xl">Pro Plan</CardTitle>
          <p className="mt-2">Advanced tools for serious growth</p>
          <p className="mt-2 text-4xl font-bold">
            $12{' '}
            <span className="text-muted-foreground text-xl font-normal line-through">
              15
            </span>
            <span className="text-muted-foreground ml-1 text-base font-normal">
              /month
            </span>
          </p>
          <Button
            variant="default"
            className="mt-5 rounded-full"
            onClick={isProPlan ? handleManagePlanClick : handleUpgradeClick}
          >
            {isProPlan ? 'Manage Plan' : 'Get Started'}
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 px-4">
          <h2 className="text-sm font-semibold">Operational Features</h2>
          <ul className="my-2 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Check className="size-4" />
              Unlimited Autopilot actions
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4" />
              Unlimited scheduled posts
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4" />
              Advance Style Config available
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4" />
              Supports LinkedIn + Twitter
              <span className="text-muted-foreground text-xs">
                (threads coming soon)
              </span>
            </li>
          </ul>

          <h2 className="mt-2 text-sm font-semibold">AI Generation</h2>
          <ul className="my-2 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Check className="size-4" />
              1,000 AI Generation credits per month
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4" />
              Advanced AI Generation
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4" />
              Web Search
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default PlanCards

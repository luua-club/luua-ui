import { createLazyRoute } from '@tanstack/react-router'
import { Check, Flower, Sprout, X } from 'lucide-react'

import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'

function Payments() {
  return (
    <div className="m-auto max-w-4xl p-2">
      <div className="mt-4 py-4 text-center">
        <h1 className="text-3xl font-bold">Pricing Details</h1>
        <p className="text-muted-foreground my-2">
          A Comprehensive Breakdown of Our Pricing Plans to Help You Make the
          Best Choice!
        </p>
      </div>
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
              Current Plan
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 px-4">
            <h2 className="text-sm font-semibold">Operational Features</h2>
            <ul className="my-2 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="size-4" />5 Auto Gen actions per month
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
                High Demand
              </Badge>
            </div>
            <CardTitle className="mt-4 text-2xl">Pro Plan</CardTitle>
            <p className="mt-2">Advanced tools for serious growth</p>
            <p className="mt-2 text-4xl font-bold">
              $10
              <span className="text-muted-foreground ml-1 text-base font-normal">
                /month
              </span>
            </p>
            <Button variant="default" className="mt-5 rounded-full">
              Upgrade Plan
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 px-4">
            <h2 className="text-sm font-semibold">Operational Features</h2>
            <ul className="my-2 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="size-4" />
                Unlimited Auto Mode actions
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
    </div>
  )
}

export const Route = createLazyRoute('/payments')({
  component: Payments,
})

export default Payments

import { Check, Flower } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'

function PlanCards() {
  return (
    <div className="my-2">
      <Card className="h-fit rounded-2xl border p-2 shadow-none">
        <CardHeader className="bg-secondary rounded-2xl p-5">
          <Card className="dark:bg-card-foreground dark:text-card w-fit rounded-md p-2">
            <Flower />
          </Card>
          <CardTitle className="mt-4 text-2xl">Pro Enabled</CardTitle>
          <p className="text-muted-foreground mt-2 text-sm">
            All accounts include Pro features. No upgrades required.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 px-4">
          <h2 className="text-sm font-semibold">What you get</h2>
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
              Advanced style configuration
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4" />
              LinkedIn + X / Twitter support
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4" />
              1,000 AI Generation credits per month
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default PlanCards

import { format } from 'date-fns'
import { Flower, InfinityIcon } from 'lucide-react'

import { useUserState } from '@/core/hooks/user-state.hook'
import { IUsageSummary } from '@/core/models/payment.model'
import { Card, CardContent, CardHeader } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import { cn } from '@/shared/utils'

interface IUsageSummaryProps {
  usageSummary: IUsageSummary | undefined
}

function UsageSummary({ usageSummary }: IUsageSummaryProps) {
  const user = useUserState()
  const isProPlan = user?.plan === 'Pro'

  if (!usageSummary) {
    return <UsageSummarySkeleton />
  }

  return (
    <>
      <div className="my-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <p className="text-3xl font-semibold">Current Plan</p>
          <p className="text-muted-foreground text-sm text-balance">
            Your limit will reset on
            <span className="ml-1 font-semibold text-cyan-600 dark:text-cyan-400">
              {format(
                new Date(usageSummary.cycle_period.end_date),
                'dd MMM yyyy'
              )}
            </span>
          </p>
        </div>

        <Card className="gap-2 rounded-md p-3 shadow-none">
          <CardHeader className="flex items-center gap-1 px-2">
            <Flower className="size-4" />
            <p className="font-semibold">
              {isProPlan ? 'Pro' : 'Free'}
              {isProPlan ? (
                <span className="text-muted-foreground ml-2 text-xs">
                  10$/month
                </span>
              ) : (
                <span className="text-muted-foreground ml-2 text-xs">
                  0$/month
                </span>
              )}
            </p>
          </CardHeader>

          <CardContent className="px-2">
            <p className="text-muted-foreground text-xs">
              {isProPlan
                ? 'Advanced tools for serious growth'
                : 'Basic tools for exploring'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-background mt-4 mb-10 rounded-2xl border p-0 shadow-none">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-4 p-4">
            <p className="text-muted-foreground text-sm font-medium">
              Remaining Credits
            </p>
            <p
              className={cn(
                'text-3xl font-semibold tracking-tight',
                usageSummary.credits.consumed >= usageSummary.credits.total &&
                  'text-destructive'
              )}
            >
              {usageSummary.credits.consumed}{' '}
              <span className="text-muted-foreground text-base">
                / {usageSummary.credits.total}
              </span>
            </p>
          </div>

          <div className="space-y-4 p-4 sm:border-r-2 sm:border-l-2 sm:border-dashed">
            <p className="text-muted-foreground text-sm font-medium">
              Auto Pilot Posts
            </p>
            <p
              className={cn(
                'text-3xl font-semibold tracking-tight',
                usageSummary.limits.auto_pilot_posts.total !== -1 &&
                  usageSummary.limits.auto_pilot_posts.used >=
                    usageSummary.limits.auto_pilot_posts.total &&
                  'text-destructive'
              )}
            >
              {usageSummary.limits.auto_pilot_posts.total !== -1 ? (
                usageSummary.limits.auto_pilot_posts.used
              ) : (
                <InfinityIcon className="size-8" />
              )}{' '}
              <span className="text-muted-foreground text-base">
                {usageSummary.limits.auto_pilot_posts.total !== -1
                  ? `/ ${usageSummary.limits.auto_pilot_posts.total}`
                  : null}
              </span>
            </p>
          </div>

          <div className="space-y-4 p-4">
            <p className="text-muted-foreground text-sm font-medium">
              Scheduled Posts
            </p>
            <p
              className={cn(
                'text-3xl font-semibold tracking-tight',
                usageSummary.limits.scheduled_posts.total !== -1 &&
                  usageSummary.limits.scheduled_posts.used >=
                    usageSummary.limits.scheduled_posts.total &&
                  'text-destructive'
              )}
            >
              {usageSummary.limits.scheduled_posts.total !== -1 ? (
                usageSummary.limits.scheduled_posts.used
              ) : (
                <InfinityIcon className="size-8" />
              )}{' '}
              <span className="text-muted-foreground text-base">
                {usageSummary.limits.scheduled_posts.total !== -1
                  ? `/ ${usageSummary.limits.scheduled_posts.total}`
                  : null}
              </span>
            </p>
          </div>
        </div>
      </Card>
    </>
  )
}

function UsageSummarySkeleton() {
  return (
    <>
      <div className="my-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-4 w-72" />
        </div>

        <Card className="gap-2 rounded-md p-3 shadow-none">
          <CardHeader className="flex items-center gap-2 px-2">
            <Skeleton className="size-5 rounded-full" />
            <Skeleton className="h-4 w-28" />
          </CardHeader>

          <CardContent className="space-y-2 px-2">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-background mt-4 mb-10 rounded-2xl border p-0 shadow-none">
        <div className="grid md:grid-cols-2 md:items-start lg:grid-cols-3">
          <div className="space-y-4 p-4">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-8 w-32" />
          </div>

          <div className="space-y-4 p-4 sm:border-r-2 sm:border-l-2 sm:border-dashed">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-8 w-32" />
          </div>

          <div className="space-y-4 p-4">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </Card>
    </>
  )
}

export default UsageSummary

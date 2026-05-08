import { Card, CardContent, CardHeader } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import { cn } from '@/shared/utils'

export function OverviewSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <SocialMetricCardSkeleton key={index} index={index} />
      ))}
    </div>
  )
}

export function BreakdownSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      <ChartCardSkeleton variant="area" />
      <ChartCardSkeleton variant="bar" />
      <ChartCardSkeleton variant="donut" />
    </div>
  )
}

export function ActivitySkeleton() {
  const rows = Array.from({ length: 5 })

  return (
    <Card className="gap-0 rounded-xl p-0">
      <CardHeader className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-24 rounded-md" />
          <Skeleton className="h-4 w-72 max-w-full rounded-md" />
        </div>
        <Skeleton className="h-9 w-full rounded-md sm:w-[150px]" />
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <div className="overflow-x-auto border-y">
          <div className="grid min-w-[760px] grid-cols-[minmax(240px,1fr)_110px_120px_90px_110px_120px] gap-4 px-4 py-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-16 rounded-md" />
            ))}
          </div>
          {rows.map((_, index) => (
            <div
              key={index}
              className="grid min-w-[760px] grid-cols-[minmax(240px,1fr)_110px_120px_90px_110px_120px] items-center gap-4 border-t px-4 py-3"
            >
              <div className="space-y-2">
                <Skeleton className="h-4 w-full max-w-[320px] rounded-md" />
                <Skeleton className="h-4 w-1/2 max-w-[180px] rounded-md" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="ml-auto h-4 w-12 rounded-md" />
              <Skeleton className="ml-auto h-4 w-14 rounded-md" />
              <Skeleton className="h-7 w-24 rounded-md" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <Skeleton className="h-4 w-32 rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

type ChartCardSkeletonProps = {
  variant: 'area' | 'bar' | 'donut'
}

function ChartCardSkeleton({ variant }: ChartCardSkeletonProps) {
  return (
    <Card className="w-full max-w-[400px] min-w-0 gap-0 overflow-hidden rounded-xl border p-0 shadow-none">
      <div className="flex items-start justify-between gap-4 px-5 pt-4">
        <div className="min-w-0">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="mt-3 h-8 w-20 rounded-md" />
          <Skeleton className="mt-2 h-4 w-36 rounded-md" />
        </div>
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>

      <div className="mt-4 px-5">
        {variant === 'area' && (
          <div className="h-[120px] pt-5">
            <Skeleton className="h-full rounded-t-[60%] rounded-b-xl" />
          </div>
        )}
        {variant === 'bar' && (
          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-9 flex-1 rounded-md" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-9 w-[72%] rounded-md" />
            </div>
          </div>
        )}
        {variant === 'donut' && (
          <div className="flex flex-col items-center gap-4 pt-2">
            <div className="border-accent relative size-28 rounded-full border-[22px]">
              <Skeleton className="bg-card absolute inset-5 rounded-full" />
            </div>
            <Skeleton className="size-3 rounded-full" />
          </div>
        )}
      </div>
    </Card>
  )
}

function SocialMetricCardSkeleton({ index }: { index: number }) {
  return (
    <Card className="bg-card relative h-[156px] overflow-hidden rounded-xl border p-5 shadow-sm">
      <div className="absolute top-5 right-5 z-10 flex items-center">
        <Skeleton className="size-[26px] rounded-full border" />
        <Skeleton className="-ml-2.5 size-[26px] rounded-full border" />
      </div>

      <div className="relative z-10 flex h-full max-w-[64%] flex-col justify-between">
        <div className="pr-14">
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>

        <div className="flex items-center gap-2 pb-0.5">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="size-6 rounded-full" />
        </div>
      </div>

      <Skeleton
        className={cn(
          'absolute bottom-[-34px] z-0 h-[142px] w-[92px] rounded-t-full rounded-b-none opacity-60',
          index % 2 === 0 ? 'right-[-8px]' : 'right-[-18px]'
        )}
      />
    </Card>
  )
}

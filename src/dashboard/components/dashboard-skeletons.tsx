import { FolderEdit } from 'lucide-react'

import { Card, CardContent } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'

import { DraftCardSkeleton } from './draft-card'

const PROFILE_ACTIVITY_CARD_CLASS = 'h-[224px] rounded-lg p-4 shadow-sm'

export function ProfileActivitySkeleton() {
  return (
    <div className="mb-6 grid items-stretch gap-4 xl:grid-cols-[minmax(280px,0.64fr)_minmax(0,1.36fr)]">
      <Card className={`${PROFILE_ACTIVITY_CARD_CLASS} min-w-0 gap-4`}>
        <div className="flex items-start gap-2.5">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-3 w-44 max-w-full rounded-md" />
              </div>
              <Skeleton className="size-8 shrink-0 rounded-md" />
            </div>
          </div>
          s
        </div>

        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="min-w-0 space-y-2">
              <Skeleton className="h-3 w-12 rounded-md" />
              <Skeleton className="h-4 w-20 max-w-full rounded-md" />
            </div>
          ))}
        </div>

        <div className="border-border/70 border-t pt-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <Skeleton className="h-3 w-24 rounded-md" />
            <Skeleton className="h-3 w-20 rounded-md" />
          </div>
          <Skeleton className="h-[42px] w-full rounded-md" />
        </div>
      </Card>

      <Card
        className={`${PROFILE_ACTIVITY_CARD_CLASS} w-full max-w-full gap-6`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-36 rounded-md" />
            <Skeleton className="h-3 w-56 rounded-md" />
          </div>
          <Skeleton className="h-12 w-full rounded-sm sm:w-44" />
        </div>
        <Skeleton className="h-28 w-[684px] max-w-full rounded-md" />
      </Card>
    </div>
  )
}

export function DashboardDraftGridSkeleton() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-4 flex items-center gap-6">
        <h1 className="flex gap-2 text-sm font-semibold">
          <FolderEdit className="size-5" /> Pick Up Where You Left Off
        </h1>
        <Skeleton className="h-6 w-16 rounded-sm" />
      </div>

      <div className="grid grid-cols-1 gap-4 pb-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card className="bg-card/70 h-44 w-full min-w-0 gap-0 overflow-hidden rounded-md border-dashed p-0 shadow-none">
          <CardContent className="flex h-full flex-col items-center justify-center gap-2 p-3">
            <Skeleton className="size-8 rounded-md" />
            <Skeleton className="h-4 w-20 rounded-md" />
          </CardContent>
        </Card>
        {Array.from({ length: 3 }).map((_, index) => (
          <DraftCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}

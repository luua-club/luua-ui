import { FolderEdit } from 'lucide-react'

import { Card } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'

import { DraftCardSkeleton } from './draft-card'

const PROFILE_ACTIVITY_CARD_CLASS =
  'min-h-[224px] rounded-lg p-4 shadow-sm sm:h-[224px]'

export function ProfileActivitySkeleton() {
  return (
    <div className="mb-6 grid min-w-0 items-stretch gap-4 xl:grid-cols-[minmax(280px,0.64fr)_minmax(0,1.36fr)]">
      <Card
        className={`${PROFILE_ACTIVITY_CARD_CLASS} min-w-0 gap-4 overflow-hidden pb-0`}
      >
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
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
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
        className={`${PROFILE_ACTIVITY_CARD_CLASS} w-full max-w-full min-w-0 gap-6 overflow-hidden`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-2">
            <Skeleton className="h-4 w-36 rounded-md" />
            <Skeleton className="h-3 w-full max-w-56 rounded-md" />
          </div>
          <Skeleton className="h-9 w-32 max-w-full rounded-sm sm:w-44" />
        </div>
        <Skeleton className="h-28 w-full min-w-0 rounded-md" />
      </Card>
    </div>
  )
}

export function DashboardDraftGridSkeleton() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="flex items-end gap-2.5">
          <span className="flex items-center gap-2 text-base font-semibold">
            <FolderEdit className="size-5" />
            Saved Drafts
          </span>
          <Skeleton className="mb-px h-3 w-14 rounded-sm" />
        </h1>
        <Skeleton className="h-8 w-24 shrink-0 rounded-sm" />
      </div>

      <div className="grid grid-cols-1 gap-4 pb-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <DraftCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}

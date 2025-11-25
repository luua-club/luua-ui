import { Skeleton } from '@/shared/ui/skeleton'

function LinkedInPostCardSkeleton() {
  return (
    <div className="bg-card relative rounded-lg border-1">
      {/* Header */}
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-2">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex min-w-0 flex-col">
          <Skeleton className="mb-1 h-4 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>

      {/* Media preview */}
      <div className="p-4">
        <Skeleton className="h-30 w-full rounded-md" />
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-2 px-4 pt-2 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-10" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
        <hr />
        <div className="flex justify-around">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default LinkedInPostCardSkeleton

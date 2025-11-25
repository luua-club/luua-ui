import { Skeleton } from '@/shared/ui/skeleton'

function TwitterPostCardSkeleton() {
  return (
    <div className="bg-card relative flex h-fit gap-2 rounded-lg border-1 p-4">
      {/* Avatar */}
      <Skeleton className="h-10 w-10 rounded-full md:h-12 md:w-12" />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex w-fit min-w-0 items-center">
            <Skeleton className="h-10 w-28 sm:w-40" />
            <Skeleton className="ml-2 h-10 w-24 sm:w-32" />
          </div>
        </div>

        {/* Media preview */}
        <div className="pt-4">
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>

        {/* Footer */}
        <div className="flex justify-between pt-4">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
        </div>
      </div>
    </div>
  )
}

export default TwitterPostCardSkeleton

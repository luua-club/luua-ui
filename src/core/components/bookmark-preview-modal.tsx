import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useState } from 'react'

import luuaIconLogo from '@/assets/logos/luua-icon-logo.svg'
import luuaWhiteIconLogo from '@/assets/logos/luua-white-icon-logo.svg'
import { inspirationApi } from '@/core/api/inspiration.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { type ApiResponse } from '@/core/models/api.model'
import { type Inspiration } from '@/core/models/inspiration.model'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Skeleton } from '@/shared/ui/skeleton'
import { cn } from '@/shared/utils'

interface BookmarkPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  inspirationId: string
}

function BookmarkPreviewModal({
  open,
  onOpenChange,
  inspirationId,
}: BookmarkPreviewModalProps) {
  const { data, isLoading } = useQuery<ApiResponse<Inspiration>>({
    queryKey: [QUERY_KEYS.inspirations, inspirationId],
    queryFn: ({ signal }) =>
      inspirationApi.getInspiration(inspirationId, signal),
    enabled: open && !!inspirationId,
  })

  const inspiration = data?.data

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background w-[90vw] max-w-md p-0">
        <DialogClose className="text-card-foreground z-10" />
        <DialogHeader className="text-card-foreground border-b px-5 py-4">
          <DialogTitle>Bookmark</DialogTitle>
        </DialogHeader>

        <div className="px-5 py-4">
          {isLoading && <BookmarkSkeleton />}

          {!isLoading && inspiration && (
            <div className="flex flex-col gap-4">
              {/* Source link */}
              <SourcePreview
                icon={inspiration.icon}
                title={inspiration.title}
                description={inspiration.description}
                link={inspiration.link}
              />

              {/* Additional context */}
              {inspiration.additional_context && (
                <div>
                  <p className="text-muted-foreground text-xs font-semibold uppercase">
                    Additional Context
                  </p>
                  <p className="text-primary mt-1 text-sm break-words">
                    {inspiration.additional_context}
                  </p>
                </div>
              )}

              {/* Date */}
              <p className="text-muted-foreground text-xs font-semibold">
                Added on {format(new Date(inspiration.created_at), 'PP')}
              </p>
            </div>
          )}

          {!isLoading && !inspiration && (
            <p className="text-muted-foreground py-8 text-center text-sm">
              Bookmark not found
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SourcePreview({
  icon,
  title,
  description,
  link,
}: {
  icon?: string | null
  title?: string | null
  description?: string | null
  link: string
}) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const showFallback = !icon || imgError

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-w-0 items-start gap-3 rounded-md border border-dashed p-3"
    >
      <div className="size-6 shrink-0 overflow-hidden rounded-sm">
        {showFallback ? (
          <>
            <img
              src={luuaIconLogo}
              alt="Luua"
              className="size-full object-cover object-center dark:hidden"
            />
            <img
              src={luuaWhiteIconLogo}
              alt="Luua"
              className="hidden size-full object-cover object-center dark:block"
            />
          </>
        ) : (
          <>
            {!imgLoaded && <Skeleton className="size-full rounded-sm" />}
            <img
              src={icon}
              alt={title || 'icon'}
              className={cn(
                'size-full object-cover object-center',
                !imgLoaded && 'hidden'
              )}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-primary -mt-1 line-clamp-2 text-sm font-semibold break-words underline-offset-4 hover:underline">
          {title || link}
        </p>
        {description && (
          <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs break-words">
            {description}
          </p>
        )}
      </div>
    </a>
  )
}

function BookmarkSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Source preview skeleton */}
      <div className="flex items-start gap-3 rounded-md border border-dashed p-3">
        <Skeleton className="size-6 shrink-0 rounded-sm" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
      {/* Date skeleton */}
      <Skeleton className="h-3 w-36" />
    </div>
  )
}

export default BookmarkPreviewModal

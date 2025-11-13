import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLazyRoute } from '@tanstack/react-router'
import { BookMarked, CircleSlash, Loader, SquarePlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { inspirationApi } from '@/core/api/inspiration.api'
import { EXTERNAL_URLS, QUERY_KEYS } from '@/core/config/constant'
import { InspirationResponse } from '@/core/models/inspiration.model'
import LinkContentCard from '@/shared/components/link-content-card'
import PaginationList from '@/shared/components/pagination-list'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'

import ExtentionCallout from './components/extention-callout'
import BookmarkActionModal from './containers/bookmark-action-modal'

function Bookmarks() {
  // --- State & Variables ---
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
  const [editData, setEditData] = useState<{
    id: string
    url: string
    additional_context: string | null
    utilized: boolean
  } | null>(null)
  const [offset, setOffset] = useState(0)
  const limit = 10

  // --- Hooks ---
  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useQuery<InspirationResponse>({
    queryKey: [QUERY_KEYS.inspirations, { offset, limit }],
    queryFn: async ({ signal }) => {
      const res = await inspirationApi.getInspirations(
        {
          limit,
          offset,
        },
        signal
      )
      return res.data as InspirationResponse
    },
    staleTime: 60_000,
  })

  // --- Mutations ---
  const deleteMutation = useMutation({
    mutationFn: (id: string) => inspirationApi.deleteInspiration(id),
    onMutate: (id: string) => {
      // mark as deleting for UI
      setDeletingIds(prev => {
        const next = new Set(prev)
        next.add(id)
        return next
      })
    },
    onError: (_err, id) => {
      // revert deleting flag on failure
      if (id) {
        setDeletingIds(prev => {
          const next = new Set(prev)
          next.delete(id as string)
          return next
        })
      }
      toast.error('Failed to delete inspiration')
    },
    onSettled: () => {
      // refetch list; deleting flags will be cleared on list success
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.inspirations],
      })
    },
  })

  // --- Effects ---
  // Clear deleting indicators when fresh data arrives successfully
  useEffect(() => {
    if (!isLoading && !isError && data) {
      setDeletingIds(new Set())
    }
  }, [data, isLoading, isError])

  // Clamp offset to last valid page when total shrinks (e.g., after deletions)
  useEffect(() => {
    if (!data) return

    const total = data.total ?? 0

    // If nothing left, ensure offset is 0
    if (total === 0) {
      if (offset !== 0) setOffset(0)
      return
    }

    // Compute the largest valid offset so that at least one item exists on the page
    const maxOffset = Math.floor(Math.max(total - 1, 0) / limit) * limit
    if (offset > maxOffset) {
      setOffset(maxOffset)
    }
  }, [data, limit, offset])

  // --- Computed Variables ---
  const isEmptyData = !data || data.inspirations.length === 0

  // --- Functions ---
  /**
   * Renders the body of the inspirations list
   *
   * @returns JSX.Element
   */
  const renderBody = () => {
    if (isLoading) {
      return (
        <Loader className="col-span-full mx-auto mt-6 size-5 animate-spin" />
      )
    }

    if (isError) {
      return (
        <div className="col-span-full mx-auto mt-2 flex w-full items-center justify-center gap-2 rounded-md border-1 border-dashed border-red-500 p-5.5 text-sm font-semibold text-red-500">
          <CircleSlash className="size-4" /> Failed to load bookmarks
        </div>
      )
    }

    if (isEmptyData) {
      return (
        <div className="col-span-full mx-auto flex w-full items-center justify-center gap-2 rounded-md border-1 border-dashed p-5.5 text-sm font-semibold">
          <CircleSlash className="size-4" /> No bookmarks found
        </div>
      )
    }

    return (
      <>
        {data.inspirations.map(insp => (
          <LinkContentCard
            key={insp.id}
            link={insp.link}
            description={insp.additional_context ?? undefined}
            createdAt={insp.created_at}
            utilized={insp.utilized}
            isProcessing={deletingIds.has(insp.id)}
            onEdit={() => {
              // Ensure modal is closed before reopening to avoid showModal timing issues
              setIsModalOpen(false)
              setEditData({
                id: insp.id,
                url: insp.link,
                additional_context: insp.additional_context ?? null,
                utilized: insp.utilized || false,
              })
              setTimeout(() => setIsModalOpen(true), 0)
            }}
            onDelete={() => {
              deleteMutation.mutate(insp.id)
            }}
          />
        ))}
      </>
    )
  }

  return (
    <div className="m-auto flex max-w-4xl flex-col gap-4 p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 text-center">
        <span className="flex items-center gap-2 text-lg font-bold">
          <BookMarked className="size-5" /> Bookmarks
        </span>
        <Button
          onClick={() => {
            setEditData(null)
            setIsModalOpen(true)
          }}
          size="sm"
          disabled={isLoading}
        >
          <SquarePlus className="size-4" />
          Add Manually
        </Button>
      </div>
      <Separator />

      {/* Description */}
      <p>
        Access your saved bookmarks from the{' '}
        <a
          href={EXTERNAL_URLS.chromeExt}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium hover:underline"
        >
          Luua Chrome extension
        </a>{' '}
        or add them manually. They serve as{' '}
        <span className="font-medium">inspiration for Autopilot</span> to
        generate posts. You can also consume any bookmark instantly by tapping{' '}
        <span className="font-medium">&quot;Create&quot;</span> button to
        generate a post based on that content.
      </p>

      {/* Callout */}
      <ExtentionCallout />

      {/* Body */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {renderBody()}
      </div>

      {/* Pagination */}
      {data && data.total > limit && (
        <div className="mt-4">
          <PaginationList
            limit={limit}
            offset={offset}
            total={data.total}
            onOffsetChange={setOffset}
          />
        </div>
      )}

      {/** Modal */}
      <BookmarkActionModal
        open={isModalOpen}
        onOpenChange={open => {
          setIsModalOpen(open)
          if (!open) {
            // Clear edit state when modal closes so next open can switch modes cleanly
            setEditData(null)
          }
        }}
        mode={editData ? 'edit' : 'create'}
        initialData={editData ?? undefined}
        disabled={editData?.utilized}
      />
    </div>
  )
}

//--- Lazy Route ---
export const Route = createLazyRoute('/bookmarks')({
  component: Bookmarks,
})

export default Bookmarks

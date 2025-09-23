import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, SquarePlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { inspirationApi } from '@/core/api/inspiration.api'
import { QUERY_KEYS } from '@/core/config/constant'
import type { InspirationResponse } from '@/core/models/inspiration.model'
import LinkContentCard from '@/shared/components/link-content-card'
import PaginationList from '@/shared/components/pagination-list'
import { Button } from '@/shared/ui/button'

import InspirationActionModal from './InspirationActionModal'

function InspirationsCrud() {
  // --- State & Variables ---
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
  const [editData, setEditData] = useState<{
    id: string
    url: string
    additional_context: string | null
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

  // --- Functions ---
  /**
   * Renders the body of the inspirations list
   *
   * @returns JSX.Element
   */
  const renderBody = () => {
    if (isLoading) {
      return (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          Loading inspirations...
          <Loader2 className="size-3 animate-spin" />
        </div>
      )
    }

    if (isError) {
      return (
        <div className="text-sm text-red-500">Failed to load inspirations</div>
      )
    }

    if (!data || data.inspirations.length === 0) {
      return (
        <div className="text-muted-foreground col-span-full text-sm">
          No inspirations yet. Click &quot;Add Inspiration&quot; to create one.
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
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <p className="text-muted-foreground">
          These are list of inspirations, you can add, update and delete them
          here.
        </p>
        {/* Actions */}
        <Button
          onClick={() => {
            setEditData(null)
            setIsModalOpen(true)
          }}
          variant="outline"
          size="sm"
        >
          <SquarePlus className="size-4" />
          Add Inspiration
        </Button>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
      <InspirationActionModal
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
      />
    </div>
  )
}

export default InspirationsCrud

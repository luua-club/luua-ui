import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { type DateRange } from 'react-day-picker'

import { draftsApi } from '@/core/api/drafts.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { toStartOfDayIso } from '@/core/config/utils/common.util'

export function useDraftList() {
  const queryClient = useQueryClient()

  // ----- Filters & Sorting -----
  // Date range used to fetch drafts (inclusive of `from` and `to`).
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  // Sort by created time (asc) or updated time (desc). Default prioritizes recent updates.
  const [sort, setSort] = useState<'created_at' | 'updated_at'>('updated_at')

  // ----- Pagination -----
  const [limit, setLimit] = useState<number>(5)
  const [offset, setOffset] = useState<number>(0)

  // ----- Deletion flow state -----
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  // Track which draft IDs are currently being deleted to disable UI per-item.
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())

  // ----- Derived filter values -----
  // Convert selected dates to ISO start-of-day boundaries for backend querying.
  const from = toStartOfDayIso(dateRange?.from)
  const to = toStartOfDayIso(dateRange?.to ?? dateRange?.from)

  // When sorting by created_at we use ascending to show oldest -> newest creation.
  // Otherwise default to updated_at with descending to show most recently updated first.
  const sortDir = sort === 'created_at' ? 'asc' : 'desc'

  // ----- Query: fetch drafts list -----
  const query = useQuery({
    queryKey: [QUERY_KEYS.drafts, from, to, limit, offset, sortDir],
    queryFn: () =>
      draftsApi.getDrafts({
        limit,
        offset,
        sort: sortDir,
        from,
        to,
      }),
  })

  // Fallback to empty array until data arrives.
  const drafts = query.data?.data?.posts ?? []

  // Total available drafts matching the filters, used for pagination controls.
  const total: number = query.data?.data?.total ?? 0

  // Reset to first page when filters change to avoid pointing at an empty page.
  useEffect(() => {
    setOffset(0)
  }, [from, to, sortDir])

  // ----- Mutation: delete a draft -----
  const deleteMutation = useMutation({
    mutationFn: (draftId: string) => draftsApi.deleteDraft(draftId),
  })

  // Open the confirm dialog for a specific draft.
  const openDelete = (draftId: string) => {
    setPendingDeleteId(draftId)
    setConfirmOpen(true)
  }

  // Close the confirm dialog and clear selection.
  const closeDelete = () => {
    setConfirmOpen(false)
    setPendingDeleteId(null)
  }

  // Confirm deletion of the selected draft.
  const confirmDelete = () => {
    if (!pendingDeleteId) return

    const id = pendingDeleteId
    // Mark this id as deleting to provide fine-grained UI feedback.
    setDeletingIds(prev => new Set(prev).add(id))

    deleteMutation.mutate(id, {
      onSettled: () => {
        setDeletingIds(prev => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
        // Invalidate the list so it re-fetches with the latest data.
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.drafts] })
      },
    })
  }

  // ----- Exposed API -----
  return {
    // Filters & Sorting
    dateRange,
    setDateRange,
    sort,
    setSort,
    // Pagination
    limit,
    setLimit,
    offset,
    setOffset,
    // React Query state (status, error, etc.)
    ...query,
    // Data
    drafts,
    total,
    // Deletion flow controls
    confirmOpen,
    openDelete,
    closeDelete,
    confirmDelete,
    pendingDeleteId,
    deletingIds,
    // Aggregate deletion pending flag
    isDeleting: deleteMutation.isPending,
  }
}

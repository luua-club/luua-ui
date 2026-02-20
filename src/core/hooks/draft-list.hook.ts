import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { type DateRange } from 'react-day-picker'

import { draftsApi } from '@/core/api/drafts.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { type ApiResponse } from '@/core/models/api.model'
import {
  type IDraftListResponse,
  type IDraftRenameRequest,
} from '@/core/models/draft.model'
import { toStartOfDayIso } from '@/core/utils/common.util'

export function useDraftList(
  showOnlyAutoGen: boolean = false,
  inspirationId?: string
) {
  // --- Hooks ---
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
  // Track which specific post (within a draft) is pending deletion
  const [pendingDeletePost, setPendingDeletePost] = useState<{
    draftId: string
    postId: string
  } | null>(null)
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
  const query = useQuery<ApiResponse<IDraftListResponse>>({
    queryKey: [
      QUERY_KEYS.drafts,
      from,
      to,
      limit,
      offset,
      sortDir,
      showOnlyAutoGen,
      inspirationId,
    ],
    queryFn: () =>
      draftsApi
        .getDrafts(
          {
            limit,
            offset,
            sort: sortDir,
            from: from,
            to: to,
          },
          showOnlyAutoGen
        )
        .then(x => {
          x.data.posts[0].autopilot = true
          return x
        }),
    placeholderData: prev => prev,
    refetchOnMount: 'always',
  })

  // Fallback to empty array until data arrives.
  const drafts = query.data?.data?.posts ?? []

  // Total available drafts matching the filters, used for pagination controls.
  const total: number = query.data?.data?.total ?? 0

  // Reset to first page when filters change to avoid pointing at an empty page.
  useEffect(() => {
    setOffset(0)
  }, [from, to, sortDir])

  // When the fetched page is empty but there is total data, move to previous page.
  useEffect(() => {
    const list = query.data?.data?.posts ?? []
    const totalCount: number = query.data?.data?.total ?? 0
    if (offset > 0 && totalCount > 0 && list.length === 0) {
      setOffset(Math.max(0, offset - limit))
    }

    // If there is no data at all, ensure we are on the first page
    if (totalCount === 0 && offset !== 0) {
      setOffset(0)
    }
  }, [query.data, offset, limit])

  // ----- Mutation: delete a draft -----
  const deleteMutation = useMutation({
    mutationFn: (draftId: string) => draftsApi.deleteDraft(draftId),
  })

  // ----- Mutation: rename a draft -----
  const renameMutation = useMutation({
    mutationFn: (data: IDraftRenameRequest) => draftsApi.renameDraft(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.drafts] })
    },
  })

  // ----- Mutation: delete a post within a draft -----
  const deletePostMutation = useMutation({
    mutationFn: ({ draftId, postId }: { draftId: string; postId: string }) =>
      draftsApi.deletePost(draftId, postId),
  })

  // Open the confirm dialog for a specific draft.
  const openDelete = (draftId: string) => {
    setPendingDeletePost(null)
    setPendingDeleteId(draftId)
    setConfirmOpen(true)
  }

  // Open the confirm dialog for a specific post of a draft.
  const openDeletePost = (draftId: string, postId: string) => {
    setPendingDeleteId(null)
    setPendingDeletePost({ draftId, postId })
    setConfirmOpen(true)
  }

  // Close the confirm dialog and clear selection.
  const closeDelete = () => {
    setConfirmOpen(false)
    setPendingDeleteId(null)
    setPendingDeletePost(null)
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
        // Let the query's onSuccess handle empty-page correction; just invalidate here.
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.drafts] })
      },
    })
  }

  // Confirm deletion of the selected post within a draft.
  const confirmDeletePost = () => {
    if (!pendingDeletePost) return

    const { draftId, postId } = pendingDeletePost
    // Disable the whole draft card while we delete its post.
    setDeletingIds(prev => new Set(prev).add(draftId))

    deletePostMutation.mutate(
      { draftId, postId },
      {
        onSettled: () => {
          setDeletingIds(prev => {
            const next = new Set(prev)
            next.delete(draftId)
            return next
          })
          // Let the query's onSuccess handle empty-page correction; just invalidate here.
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.drafts] })
        },
      }
    )
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
    openDeletePost,
    closeDelete,
    confirmDelete,
    confirmDeletePost,
    pendingDeleteId,
    pendingDeletePost,
    deletingIds,
    // Aggregate deletion pending flag
    isDeleting: deleteMutation.isPending || deletePostMutation.isPending,
    // Rename
    renameDraft: (id: string, name: string) =>
      renameMutation.mutate({ id, name }),
    isRenaming: renameMutation.isPending,
  }
}

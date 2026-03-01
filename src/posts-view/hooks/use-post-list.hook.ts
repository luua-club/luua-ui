import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addYears, subYears } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { type DateRange } from 'react-day-picker'

import { postsApi } from '@/core/api/posts.api'
import { QUERY_KEYS } from '@/core/config/constant'
import {
  type IPostListResponse,
  type postStatusType,
} from '@/core/models/post.model'
import { type channelType } from '@/core/models/social.model'
import { toEndOfDayIso, toStartOfDayIso } from '@/core/utils/common.util'

export type PostListStatus = postStatusType | 'all'

export function usePostList(
  initialStatus: PostListStatus = 'all',
  initialFrom?: string,
  initialTo?: string,
  initialSort?: 'asc' | 'desc',
  initialOffset?: number,
  initialChannel?: channelType
) {
  const queryClient = useQueryClient()

  // ----- Filters -----
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (!initialFrom && !initialTo) return undefined
    return {
      from: initialFrom ? new Date(initialFrom) : undefined,
      to: initialTo ? new Date(initialTo) : undefined,
    }
  })
  const [status, setStatus] = useState<PostListStatus>(initialStatus)
  const [channel, setChannel] = useState<channelType | undefined>(
    initialChannel
  )
  const [sort, setSort] = useState<'asc' | 'desc'>(initialSort ?? 'desc')

  // ----- Pagination -----
  const limit = 10
  const [offset, setOffset] = useState<number>(initialOffset ?? 0)

  // ----- Deletion flow state -----
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())

  // Stable defaults — wide range so all posts show when no date filter is set.
  const defaultFrom = useMemo(() => subYears(new Date(), 2).toISOString(), [])
  const defaultTo = useMemo(() => addYears(new Date(), 2).toISOString(), [])

  // ----- Derived filter values -----
  const from = toStartOfDayIso(dateRange?.from) ?? defaultFrom
  const to = toEndOfDayIso(dateRange?.to ?? dateRange?.from) ?? defaultTo

  // ----- Query -----
  const query = useQuery<IPostListResponse>({
    queryKey: [
      QUERY_KEYS.postList,
      from,
      to,
      status,
      channel,
      sort,
      limit,
      offset,
    ],
    queryFn: async () => {
      const res = await postsApi.listPosts({
        from,
        to,
        status: status === 'all' ? undefined : status,
        channel,
        sort,
        limit,
        offset,
      })
      return res.data
    },
    placeholderData: prev => prev,
    refetchOnMount: 'always',
  })

  const posts = query.data?.posts ?? []
  const total: number = query.data?.total ?? 0

  // Reset to first page when filters change
  useEffect(() => {
    setOffset(0)
  }, [from, to, status, channel, sort])

  // Auto-correct empty page
  useEffect(() => {
    const list = query.data?.posts ?? []
    const totalCount = query.data?.total ?? 0
    if (offset > 0 && totalCount > 0 && list.length === 0) {
      setOffset(Math.max(0, offset - limit))
    }
    if (totalCount === 0 && offset !== 0) {
      setOffset(0)
    }
  }, [query.data, offset, limit])

  // ----- Mutation: delete scheduled post -----
  const deleteMutation = useMutation({
    mutationFn: (postId: string) => postsApi.deleteScheduledPost(postId),
  })

  // ----- Mutation: retry failed post -----
  const retryMutation = useMutation({
    mutationFn: (postId: string) => postsApi.retryPost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.postList] })
    },
  })

  const openDelete = (postId: string) => {
    setPendingDeleteId(postId)
    setConfirmOpen(true)
  }

  const closeDelete = () => {
    setConfirmOpen(false)
    setPendingDeleteId(null)
  }

  const confirmDelete = () => {
    if (!pendingDeleteId) return
    const id = pendingDeleteId
    setDeletingIds(prev => new Set(prev).add(id))
    deleteMutation.mutate(id, {
      onSettled: () => {
        setDeletingIds(prev => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.postList] })
      },
    })
  }

  return {
    // Filters
    dateRange,
    setDateRange,
    status,
    setStatus,
    channel,
    setChannel,
    sort,
    setSort,
    // Pagination
    limit,
    offset,
    setOffset,
    // Query state
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching,
    // Data
    posts,
    total,
    // Delete flow
    confirmOpen,
    openDelete,
    closeDelete,
    confirmDelete,
    pendingDeleteId,
    deletingIds,
    isDeleting: deleteMutation.isPending,
    // Retry
    retryPost: (postId: string) => retryMutation.mutate(postId),
    isRetrying: retryMutation.isPending,
  }
}

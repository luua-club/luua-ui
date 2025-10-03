import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { type DateRange } from 'react-day-picker'

import { postsApi } from '@/core/api/posts.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { type ApiResponse } from '@/core/models/api.model'
import { type IScheduledPostResponse } from '@/core/models/schedule.model'
import { toStartOfDayIso } from '@/core/utils/common.util'
import { DEFAULT_TIME_SLOT_INTERVAL } from '@/shared/config/constant'
import { getTimeSlots } from '@/shared/utils/time'

const useScheduleList = () => {
  const queryClient = useQueryClient()

  // ----- Filters -----
  const today = new Date()
  const defaultTo = new Date(today)
  defaultTo.setDate(defaultTo.getDate() + 10)
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>({
    from: today,
    to: defaultTo,
  })

  // ----- Pagination -----
  const [limit, setLimit] = useState<number>(20)
  const [offset, setOffset] = useState<number>(0)

  // ----- Deletion flow state -----
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())

  // ----- Derived date filters -----
  // For schedule list, compute from/to based on selected date range
  const from = toStartOfDayIso(selectedRange?.from)
  const to = toStartOfDayIso(selectedRange?.to ?? selectedRange?.from)

  // ----- Query: fetch scheduled posts -----
  const query = useQuery<ApiResponse<IScheduledPostResponse>>({
    queryKey: [QUERY_KEYS.scheduleList, from, to, limit, offset],
    queryFn: () =>
      postsApi.getScheduledPosts({
        from,
        to,
        sort: 'desc',
        limit,
        offset,
      }),
    placeholderData: prev => prev,
    refetchOnMount: 'always',
  })

  // Ensure we never render duplicate cards by de-duplicating posts by id
  const posts = useMemo(() => {
    const list = query.data?.data?.posts ?? []
    const seen = new Set<string>()
    const unique = [] as typeof list
    for (const p of list) {
      const id = (p as unknown as { id?: string })?.id
      if (!id) continue
      if (seen.has(id)) continue
      seen.add(id)
      unique.push(p)
    }
    return unique
  }, [query.data?.data?.posts])
  const total: number = query.data?.data?.total ?? 0

  // Reset pagination when filters change
  useEffect(() => {
    setOffset(0)
  }, [from, to])

  // If current page becomes empty but there is data overall, go back a page
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

  // ----- Mutation: delete a scheduled post -----
  const deleteMutation = useMutation({
    mutationFn: (postId: string) => postsApi.deleteScheduledPost(postId),
  })

  // Open the confirm dialog for a specific scheduled post.
  const openDelete = (postId: string) => {
    setPendingDeleteId(postId)
    setConfirmOpen(true)
  }

  // Close the confirm dialog and clear selection.
  const closeDelete = () => {
    setConfirmOpen(false)
    setPendingDeleteId(null)
  }

  // Confirm deletion of the selected scheduled post.
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
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.scheduleList] })
      },
    })
  }

  // ----- Derived: Time slots and grouping -----
  const timeSlots = useMemo(() => getTimeSlots(), [])

  const groupedBySlot: Record<string, typeof posts> = useMemo(() => {
    // Initialize buckets for all available slots
    const buckets = timeSlots.reduce(
      (acc, slot) => {
        acc[slot] = [] as typeof posts
        return acc
      },
      {} as Record<string, typeof posts>
    )

    const interval = DEFAULT_TIME_SLOT_INTERVAL as number

    const toMinutes = (d: Date) => d.getHours() * 60 + d.getMinutes()

    posts
      .filter(p => Boolean(p.scheduled_at))
      .forEach(p => {
        const d = new Date(p.scheduled_at as string)
        const mins = toMinutes(d)
        // Floor to the start of the slot interval (e.g., 12:30 -> 12:00 for 60m interval)
        let rounded = Math.floor(mins / interval) * interval
        const total = 24 * 60
        if (rounded >= total) rounded = total - interval // safety, though floor shouldn't exceed total
        const hour = Math.floor(rounded / 60)
        const minute = rounded % 60
        const key = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`
        if (buckets[key]) buckets[key].push(p)
      })

    // Sort each bucket by actual scheduled time ascending for readability
    Object.keys(buckets).forEach(k => {
      buckets[k].sort((a, b) => {
        const ta = new Date(a.scheduled_at as string).getTime()
        const tb = new Date(b.scheduled_at as string).getTime()
        return ta - tb
      })
    })

    return buckets
  }, [posts, timeSlots])

  const formatHour = (h: number) => format(new Date(2000, 0, 1, h), 'h a')

  const formatSlotRange = (slot: string) => {
    const [h, m] = slot.split(':').map(Number)
    const start = new Date(2000, 0, 1, h, m)
    const end = new Date(start)
    end.setMinutes(end.getMinutes() + (DEFAULT_TIME_SLOT_INTERVAL as number))
    const startStr = format(start, 'hh:mm a')
    const endStr = format(end, 'hh:mm a')
    return `${startStr} - ${endStr}`
  }

  const orderedSlots = useMemo(() => {
    // Render all slots exactly as returned by getTimeSlots(),
    // and rely on groupedBySlot[slot] to contain posts (or empty array).
    return timeSlots
  }, [timeSlots])

  const formatSelectedRange = () => {
    if (!selectedRange?.from) return ''
    const fromDate = selectedRange.from
    const toDate = selectedRange.to ?? selectedRange.from
    if (fromDate.getTime() === toDate.getTime())
      return format(fromDate, 'MMM d, yyyy')
    return `${format(fromDate, 'MMM d, yyyy')} – ${format(toDate, 'MMM d, yyyy')}`
  }

  return {
    // Filters
    selectedRange,
    setSelectedRange,
    // Pagination
    limit,
    setLimit,
    offset,
    setOffset,
    // React Query state
    ...query,
    // Data
    posts,
    total,
    // Derived helpers
    groupedBySlot,
    orderedSlots,
    formatHour,
    formatSlotRange,
    formatSelectedRange,
    // Deletion controls
    confirmOpen,
    openDelete,
    closeDelete,
    confirmDelete,
    pendingDeleteId,
    deletingIds,
    isDeleting: deleteMutation.isPending,
  }
}

export default useScheduleList

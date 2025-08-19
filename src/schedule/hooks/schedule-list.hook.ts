import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { type DateRange } from 'react-day-picker'

import { postsApi } from '@/core/api/posts.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { toStartOfDayIso } from '@/core/config/utils/common.util'
import { type ApiResponse } from '@/core/models/api.model'
import { type IScheduledPostResponse } from '@/core/models/schedule.model'

const useScheduleList = () => {
  // ----- Filters -----
  const today = new Date()
  const defaultTo = new Date(today)
  defaultTo.setDate(defaultTo.getDate() + 10)
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>({
    from: today,
    to: defaultTo,
  })
  const [sort, setSort] = useState<'created_at' | 'updated_at'>('updated_at')

  // ----- Pagination -----
  const [limit, setLimit] = useState<number>(4)
  const [offset, setOffset] = useState<number>(0)

  // ----- Derived date filters -----
  // For schedule list, compute from/to based on selected date range
  const from = toStartOfDayIso(selectedRange?.from)
  const to = toStartOfDayIso(selectedRange?.to ?? selectedRange?.from)
  const sortDir = sort === 'created_at' ? 'asc' : 'desc'

  // ----- Query: fetch scheduled posts -----
  const query = useQuery<ApiResponse<IScheduledPostResponse>>({
    queryKey: [QUERY_KEYS.scheduleList, from, to, sortDir, limit, offset],
    queryFn: () =>
      postsApi.getScheduledPosts({
        from,
        to,
        sort: sortDir,
        limit,
        offset,
      }),
    placeholderData: prev => prev,
    refetchOnMount: 'always',
  })

  const posts = query.data?.data?.posts ?? []
  const total: number = query.data?.data?.total ?? 0

  // Reset pagination when filters change
  useEffect(() => {
    setOffset(0)
  }, [from, to, sort])

  // If current page becomes empty but there is data overall, go back a page
  useEffect(() => {
    const list = query.data?.data?.posts ?? []
    const totalCount: number = query.data?.data?.total ?? 0
    if (offset > 0 && totalCount > 0 && list.length === 0) {
      setOffset(Math.max(0, offset - limit))
    }
  }, [query.data, offset, limit])

  // ----- Derived: Time buckets and formatting -----
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), [])

  const groupedByHour: Record<number, typeof posts> = useMemo(() => {
    const buckets: Record<number, typeof posts> = hours.reduce(
      (acc, h) => {
        acc[h] = []
        return acc
      },
      {} as Record<number, typeof posts>
    )

    posts
      .filter(p => Boolean(p.scheduled_at))
      .forEach(p => {
        const d = new Date(p.scheduled_at as string)
        const hour = d.getHours()
        const minute = d.getMinutes()
        const nearestHour = (minute >= 30 ? hour + 1 : hour) % 24
        buckets[nearestHour].push(p)
      })

    // Sort each bucket by actual scheduled time ascending for readability
    hours.forEach(h => {
      buckets[h].sort((a, b) => {
        const ta = new Date(a.scheduled_at as string).getTime()
        const tb = new Date(b.scheduled_at as string).getTime()
        return ta - tb
      })
    })

    return buckets
  }, [posts, hours])

  const formatHour = (h: number) => format(new Date(2000, 0, 1, h), 'h a')

  const orderedHours = useMemo(() => {
    const hoursWithPosts = hours.filter(h => groupedByHour[h].length > 0)
    const currentHour = new Date().getHours()
    return [...hoursWithPosts].sort(
      (a, b) => ((a - currentHour + 24) % 24) - ((b - currentHour + 24) % 24)
    )
  }, [groupedByHour, hours])

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
    sort,
    setSort,
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
    groupedByHour,
    orderedHours,
    formatHour,
    formatSelectedRange,
  }
}

export default useScheduleList

import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'

import { postsApi } from '@/core/api/posts.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { ApiResponse } from '@/core/models/api.model'
import { IPost } from '@/core/models/post.model'
import { IPublishedPostListResponse } from '@/core/models/published-post.model'
import { toStartOfDayIso } from '@/core/utils/common.util'

const usePublishList = () => {
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null)

  // ----- Filters & Sorting -----
  // Date range used to fetch drafts (inclusive of `from` and `to`).
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  // Sort by created time (asc) or updated time (desc). Default prioritizes recent updates.
  const [sort, setSort] = useState<'created_at' | 'updated_at'>('updated_at')

  // ----- Pagination -----
  const [limit, setLimit] = useState<number>(5)
  const [offset, setOffset] = useState<number>(0)

  // ----- Derived date filters -----
  // For schedule list, compute from/to based on selected date range
  const from = toStartOfDayIso(dateRange?.from)
  const to = toStartOfDayIso(dateRange?.to ?? dateRange?.from)

  // When sorting by created_at we use ascending to show oldest -> newest creation.
  // Otherwise default to updated_at with descending to show most recently updated first.
  const sortDir = sort === 'created_at' ? 'asc' : 'desc'

  // ----- Query: fetch published posts -----
  const query = useQuery<ApiResponse<IPublishedPostListResponse>>({
    queryKey: [QUERY_KEYS.publishList, from, to, limit, offset, sortDir],
    queryFn: () =>
      postsApi.getPublishedPosts({
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

  // Reset to first page when filters change to avoid pointing at an empty page.
  useEffect(() => {
    setOffset(0)
  }, [from, to, sortDir])

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
    setSelectedPost(null)
  }, [query.data, offset, limit])

  return {
    ...query,
    posts,
    total,
    limit,
    setLimit,
    offset,
    setOffset,
    dateRange,
    setDateRange,
    sort,
    setSort,
    selectedPost,
    setSelectedPost,
  }
}

export default usePublishList

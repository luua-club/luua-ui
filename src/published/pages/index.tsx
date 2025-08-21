import { createLazyRoute } from '@tanstack/react-router'
import { format } from 'date-fns'
import { SearchSlash, TriangleAlert } from 'lucide-react'

import Post from '@/core/components/Post'
import PostListViewLayout from '@/core/layouts/PostListViewLayout'
import PaginationList from '@/shared/components/pagination-list'
import { cn } from '@/shared/utils'

import usePublishList from '../hooks/publish-list.hook'

const Published = () => {
  const {
    dateRange,
    setDateRange,
    selectedPost,
    isPending,
    sort,
    setSort,
    posts,
    setSelectedPost,
    total,
    limit,
    offset,
    setOffset,
  } = usePublishList()
  return (
    <PostListViewLayout
      title="Published Posts"
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
      selectedPost={selectedPost}
      isPending={isPending}
      sort={sort}
      onSortChange={setSort}
    >
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className={`relative flex flex-col gap-2`}>
            <div
              className={`cursor-pointer rounded-lg border-2 ${
                selectedPost?.id === post.id
                  ? 'border-black'
                  : 'border-transparent'
              }`}
              onClick={() => setSelectedPost(post)}
            >
              <Post tileView {...post} />
              {post.status === 'Failed' && (
                <div
                  className={cn(
                    'absolute -top-2 -right-2 rounded-full border-1 border-dashed bg-white p-1 text-yellow-600',
                    selectedPost?.id === post.id && 'border-black'
                  )}
                >
                  <TriangleAlert className="size-4" />
                </div>
              )}
            </div>
            <div className="absolute right-3 bottom-2 flex w-fit items-center justify-end rounded-full bg-white px-2 py-1 text-xs text-gray-500">
              {post.published_at &&
                format(new Date(post.published_at as string), 'MMM d, h:mm a')}
            </div>
          </div>
        ))}

        {total > limit && (
          <div className="mt-8 mb-8">
            <PaginationList
              limit={limit}
              offset={offset}
              total={total}
              onOffsetChange={setOffset}
            />
          </div>
        )}

        {posts.length === 0 && (
          <div className="flex h-96 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-gray-500">
            <SearchSlash className="size-12" />
            <p className="font-semibold">No published posts found</p>
          </div>
        )}
      </div>
    </PostListViewLayout>
  )
}

export const Route = createLazyRoute('/published')({
  component: Published,
})

export default Published

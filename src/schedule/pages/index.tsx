import { createLazyRoute } from '@tanstack/react-router'
import { MonitorSmartphone } from 'lucide-react'
import { useState } from 'react'

import ListControls from '@/core/components/ListControls'
import Post, { PostSkeleton } from '@/core/components/Post'
import LinkedInPost from '@/core/components/post-preview/LinkedInPost'
import TwitterPost from '@/core/components/post-preview/TwitterPost'
import { IPost } from '@/core/models/post.model'
import PaginationList from '@/shared/components/pagination-list'

import useScheduleList from '../hooks/schedule-list.hook'

const Schedule = () => {
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null)
  const {
    isPending,
    selectedRange,
    setSelectedRange,
    groupedByHour,
    orderedHours,
    formatHour,
    formatSelectedRange,
    limit,
    offset,
    sort,
    setSort,
    total,
    setOffset,
  } = useScheduleList()

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 p-5">
      {/** Controls */}
      <ListControls
        dateRange={selectedRange}
        onDateRangeChange={setSelectedRange}
        sort={sort}
        onSortChange={setSort}
        hideSort
      />

      {/** Header */}
      <div className="flex flex-col items-end justify-between sm:flex-row">
        <h1 className="text-xl font-medium">Scheduled Posts</h1>
        <p className="text-base font-semibold text-gray-500">
          {formatSelectedRange()}
        </p>
      </div>

      <div className="flex gap-4">
        {/** Post List */}
        <div className="w-full space-y-6 lg:basis-3/4">
          {isPending ? (
            <PostSkeleton tileView />
          ) : (
            <>
              {orderedHours.map(h => (
                <div
                  key={h}
                  className="space-y-3 rounded-lg border-2 border-dashed p-2"
                >
                  <h3 className="text-base font-semibold text-gray-500">
                    {formatHour(h)}
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {groupedByHour[h].map(post => (
                      <div
                        key={post.id}
                        role="button"
                        className={`cursor-pointer rounded-lg border-2 ${
                          selectedPost?.id === post.id
                            ? 'border-black'
                            : 'border-transparent'
                        }`}
                        onClick={() => setSelectedPost(post)}
                      >
                        <Post tileView {...post} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {orderedHours.length > 0 && total > limit && (
                <div className="mt-8 mb-8">
                  <PaginationList
                    limit={limit}
                    offset={offset}
                    total={total}
                    onOffsetChange={setOffset}
                  />
                </div>
              )}
            </>
          )}
        </div>

        <div className="hidden lg:block lg:min-w-96 lg:basis-1/2">
          {selectedPost ? (
            selectedPost.channel === 'Twitter' ? (
              <TwitterPost notEditable initialContent={selectedPost.content} />
            ) : (
              <LinkedInPost notEditable initialContent={selectedPost.content} />
            )
          ) : (
            <div className="flex h-96 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-gray-500">
              <MonitorSmartphone size={48} />
              <p className="font-semibold">Click a post to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const Route = createLazyRoute('/schedule')({
  component: Schedule,
})

export default Schedule

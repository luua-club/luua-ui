import { MonitorSmartphone } from 'lucide-react'
import { ReactNode } from 'react'
import { DateRange } from 'react-day-picker'

import ListControls from '@/core/components/ListControls'
import LinkedInPost from '@/core/components/post-preview/LinkedInPost'
import TwitterPost from '@/core/components/post-preview/TwitterPost'

import { PostSkeleton } from '../components/Post'

type SortType = 'created_at' | 'updated_at'

type PostPreview = {
  id: string | number
  channel: string
  content: string
}

type Props = {
  title: string
  dateRange: DateRange | undefined
  onDateRangeChange: (value: DateRange | undefined) => void
  sort?: SortType
  onSortChange?: (value: SortType) => void
  hideSort?: boolean
  dateRangeLabel?: string
  selectedPost?: PostPreview | null
  children: ReactNode
  isPending: boolean
}

const PostListViewLayout = ({
  title,
  dateRange,
  onDateRangeChange,
  sort,
  onSortChange,
  hideSort,
  dateRangeLabel,
  selectedPost,
  children,
  isPending,
}: Props) => {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 p-5">
      {/* Controls */}
      <ListControls
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
        sort={sort}
        onSortChange={onSortChange}
        hideSort={hideSort}
      />

      {/* Header */}
      <div className="flex flex-col items-end justify-between sm:flex-row">
        <h1 className="text-xl font-medium">{title}</h1>
        {dateRangeLabel ? (
          <p className="text-base font-semibold text-gray-500">
            {dateRangeLabel}
          </p>
        ) : null}
      </div>

      <div className="flex gap-4">
        {/* Left: List Container - children are rendered here */}
        <div className="w-full space-y-6 lg:basis-3/4">
          {isPending ? <PostSkeleton tileView /> : children}
        </div>

        {/* Right: Preview Panel */}
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

export default PostListViewLayout

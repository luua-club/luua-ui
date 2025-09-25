import { ReactNode } from 'react'
import { DateRange } from 'react-day-picker'

import ListControls from '@/core/components/ListControls'

import { PostSkeleton } from '../components/Post'

type SortType = 'created_at' | 'updated_at'

type Props = {
  title: string
  dateRange: DateRange | undefined
  onDateRangeChange: (value: DateRange | undefined) => void
  sort?: SortType
  onSortChange?: (value: SortType) => void
  hideSort?: boolean
  dateRangeLabel?: string
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
  children,
  isPending,
}: Props) => {
  return (
    <div className="m-auto flex max-w-4xl flex-col gap-4 p-5">
      {/* Controls */}
      <ListControls
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
        sort={sort}
        onSortChange={onSortChange}
        hideSort={hideSort}
        allDateSelectable
      />

      {/* Header */}
      <div className="mt-4 flex flex-col justify-between sm:flex-row sm:items-end">
        <h1 className="text-xl font-medium">{title}</h1>
        {dateRangeLabel ? (
          <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
            {dateRangeLabel}
          </p>
        ) : null}
      </div>

      <div className="w-full space-y-6">
        {isPending ? <PostSkeleton tileView /> : children}
      </div>
    </div>
  )
}

export default PostListViewLayout

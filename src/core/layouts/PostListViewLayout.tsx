import { Loader } from 'lucide-react'
import { ReactNode } from 'react'
import { DateRange } from 'react-day-picker'

import ListControls from '@/core/components/ListControls'

type SortType = 'created_at' | 'updated_at'

type Props = {
  title: ReactNode
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
  children,
  isPending,
}: Props) => {
  return (
    <div className="m-auto flex max-w-4xl flex-col gap-4 p-5">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        {/* Header */}
        <h1 className="text-lg font-bold">{title}</h1>

        {/* Controls */}
        {hideSort && (
          <ListControls
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
            sort={sort}
            onSortChange={onSortChange}
            hideSort={hideSort}
            allDateSelectable
          />
        )}
      </div>

      {!hideSort && (
        <div className="mt-4">
          <ListControls
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
            sort={sort}
            onSortChange={onSortChange}
            hideSort={hideSort}
            allDateSelectable
          />
        </div>
      )}

      <div className="w-full space-y-6">
        {isPending ? (
          <Loader className="mx-auto mt-8 size-5 animate-spin" />
        ) : (
          children
        )}
      </div>
    </div>
  )
}

export default PostListViewLayout

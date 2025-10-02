import { useQueryClient } from '@tanstack/react-query'
import { addYears, endOfYear, startOfToday } from 'date-fns'
import { CircleX } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import DateRangePicker from '@/shared/components/date-range-picker'
import { Button } from '@/shared/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

import { QUERY_KEYS } from '../config/constant'

type ListControlsProps = {
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  sort?: 'created_at' | 'updated_at'
  onSortChange?: (value: 'created_at' | 'updated_at') => void
  hideSort?: boolean
  allDateSelectable?: boolean
}

const ListControls = ({
  dateRange,
  onDateRangeChange,
  sort,
  onSortChange,
  hideSort = false,
  allDateSelectable = false,
}: ListControlsProps) => {
  const queryClient = useQueryClient()

  const today = startOfToday()
  const maxDate = endOfYear(addYears(today, 1))

  return (
    <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
      <div className="flex w-full items-center gap-2">
        <DateRangePicker
          value={dateRange}
          onValueChange={onDateRangeChange}
          className="w-full md:w-auto"
          startMonth={allDateSelectable ? undefined : today}
          endMonth={allDateSelectable ? undefined : maxDate}
          disabled={
            allDateSelectable
              ? undefined
              : [{ before: today }, { after: maxDate }]
          }
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground size-8"
              onClick={() => {
                onDateRangeChange(undefined)
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.drafts] })
              }}
            >
              <CircleX />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Clear dates</TooltipContent>
        </Tooltip>
      </div>

      {!hideSort && onSortChange && (
        <Select
          value={sort}
          onValueChange={(v: 'created_at' | 'updated_at') => onSortChange(v)}
        >
          <SelectTrigger className="w-full md:w-auto">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Oldest</SelectItem>
            <SelectItem value="updated_at">Latest</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  )
}

export default ListControls

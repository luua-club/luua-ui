import { useQueryClient } from '@tanstack/react-query'
import { addYears, endOfYear, startOfToday } from 'date-fns'
import { ChevronsDown, ChevronsUp, CircleX } from 'lucide-react'
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
  allExpanded?: boolean
  onToggleExpandAll?: () => void
}

const ListControls = ({
  dateRange,
  onDateRangeChange,
  sort,
  onSortChange,
  hideSort = false,
  allDateSelectable = false,
  allExpanded,
  onToggleExpandAll,
}: ListControlsProps) => {
  const queryClient = useQueryClient()

  const today = startOfToday()
  const maxDate = endOfYear(addYears(today, 1))

  return (
    <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
      <div className="flex w-full items-center gap-1 md:w-auto">
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
              className="size-8"
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

      <div className="ml-auto flex w-full items-center justify-end gap-2 md:w-auto md:self-auto">
        {onToggleExpandAll && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={onToggleExpandAll}
              >
                {allExpanded ? (
                  <ChevronsUp className="size-4" />
                ) : (
                  <ChevronsDown className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {allExpanded ? 'Collapse all' : 'Expand all'}
            </TooltipContent>
          </Tooltip>
        )}

        {!hideSort && onSortChange && (
          <div className="flex items-center gap-2 whitespace-nowrap">
            <p className="shrink-0 text-sm font-medium">Sort by</p>
            <div className="bg-card flex items-center">
              <Select
                value={sort}
                onValueChange={(v: 'created_at' | 'updated_at') =>
                  onSortChange(v)
                }
              >
                <SelectTrigger className="w-[140px] font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Oldest</SelectItem>
                  <SelectItem value="updated_at">Latest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ListControls

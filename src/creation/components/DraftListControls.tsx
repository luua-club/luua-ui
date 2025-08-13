import { DateRange } from 'react-day-picker'

import DateRangePicker from '@/shared/components/date-range-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'

type DraftListControlsProps = {
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  sort?: 'created_at' | 'updated_at'
  onSortChange: (value: 'created_at' | 'updated_at') => void
}

const DraftListControls = ({
  dateRange,
  onDateRangeChange,
  sort,
  onSortChange,
}: DraftListControlsProps) => {
  return (
    <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
      <DateRangePicker value={dateRange} onValueChange={onDateRangeChange} />

      <Select
        value={sort}
        onValueChange={(v: 'created_at' | 'updated_at') => onSortChange(v)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="created_at">Oldest</SelectItem>
          <SelectItem value="updated_at">Latest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default DraftListControls

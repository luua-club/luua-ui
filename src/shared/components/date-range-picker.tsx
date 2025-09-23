import { ChevronDownIcon } from 'lucide-react'
import * as React from 'react'
import { type DateRange, type Matcher } from 'react-day-picker'

import { Button } from '@/shared/ui/button'
import { Calendar } from '@/shared/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'

type DateRangePickerProps = {
  value?: DateRange
  onValueChange?: (range: DateRange | undefined) => void
  className?: string
  startMonth?: Date
  endMonth?: Date
  disabled?: Matcher | Matcher[]
}

export default function DateRangePicker({
  value,
  onValueChange,
  className,
  startMonth,
  endMonth,
  disabled,
}: DateRangePickerProps) {
  const [uncontrolledRange, setUncontrolledRange] = React.useState<
    DateRange | undefined
  >(undefined)

  // Prefer controlled value if provided; otherwise use internal state
  const selectedRange = value ?? uncontrolledRange

  return (
    <div className={`flex flex-col gap-3 ${className ?? ''}`}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="dates"
            className="w-full justify-between font-normal"
          >
            {selectedRange?.from && selectedRange?.to
              ? `${selectedRange.from.toLocaleDateString()} - ${selectedRange.to.toLocaleDateString()}`
              : 'Select date'}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full overflow-hidden p-0" align="start">
          <Calendar
            mode="range"
            selected={selectedRange}
            captionLayout="dropdown"
            className="w-full"
            startMonth={startMonth}
            endMonth={endMonth}
            disabled={disabled}
            onSelect={range => {
              // Update internal state for uncontrolled usage
              setUncontrolledRange(range)
              // Notify parent if controlled
              onValueChange?.(range)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

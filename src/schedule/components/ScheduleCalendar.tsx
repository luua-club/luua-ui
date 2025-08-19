import { type DateRange } from 'react-day-picker'

import DateRangePicker from '@/shared/components/date-range-picker'
import { Calendar } from '@/shared/ui/calendar'

interface ScheduleCalendarProps {
  selectedRange: DateRange | undefined
  setSelectedRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}

const ScheduleCalendar = ({
  selectedRange,
  setSelectedRange,
}: ScheduleCalendarProps) => {
  return (
    <>
      <div className="hidden lg:block">
        <Calendar
          mode="range"
          selected={selectedRange}
          onSelect={setSelectedRange}
          captionLayout="dropdown"
          className="rounded-lg border-1"
        />
      </div>

      <div className="lg:hidden">
        <DateRangePicker
          value={selectedRange}
          onValueChange={setSelectedRange}
          className="w-full"
        />
      </div>
    </>
  )
}

export default ScheduleCalendar

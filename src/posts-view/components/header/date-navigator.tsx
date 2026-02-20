import {
  addMonths,
  endOfMonth,
  format,
  isSameMonth,
  startOfMonth,
  subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo } from 'react'

import { useCalendar } from '@/posts-view/contexts/calendar-context'
import { IEvent } from '@/posts-view/models/interfaces'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'

interface IProps {
  events: IEvent[]
}

export function DateNavigator({ events }: IProps) {
  const { selectedDate, setSelectedDate } = useCalendar()

  const month = format(selectedDate, 'MMMM')
  const year = selectedDate.getFullYear()

  const eventCount = useMemo(
    () =>
      events.filter(event =>
        isSameMonth(new Date(event.startDate), selectedDate)
      ).length,
    [events, selectedDate]
  )

  const handlePrevious = () => setSelectedDate(subMonths(selectedDate, 1))
  const handleNext = () => setSelectedDate(addMonths(selectedDate, 1))

  const rangeStart = format(startOfMonth(selectedDate), 'MMM d, yyyy')
  const rangeEnd = format(endOfMonth(selectedDate), 'MMM d, yyyy')

  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">
          {month} {year}
        </span>
        <Badge variant="outline" className="px-1.5">
          {eventCount} events
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="size-6.5 px-0 [&_svg]:size-4.5"
          onClick={handlePrevious}
        >
          <ChevronLeft />
        </Button>

        <p className="text-muted-foreground text-sm">
          {rangeStart} - {rangeEnd}
        </p>

        <Button
          variant="outline"
          className="size-6.5 px-0 [&_svg]:size-4.5"
          onClick={handleNext}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}

import { useMemo } from 'react'

import { useCalendar } from '@/posts-view/contexts/calendar-context'
import { IEvent } from '@/posts-view/models/interfaces'
import {
  calculateMonthEventPositions,
  getCalendarCells,
} from '@/posts-view/utils/helpers'

import { DayCell } from './day-cell'

interface IProps {
  singleDayEvents: IEvent[]
  multiDayEvents: IEvent[]
}

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function CalendarMonthView({ singleDayEvents, multiDayEvents }: IProps) {
  const { selectedDate } = useCalendar()

  const allEvents = [...multiDayEvents, ...singleDayEvents]

  const cells = useMemo(() => getCalendarCells(selectedDate), [selectedDate])

  const eventPositions = useMemo(
    () =>
      calculateMonthEventPositions(
        multiDayEvents,
        singleDayEvents,
        selectedDate
      ),
    [multiDayEvents, singleDayEvents, selectedDate]
  )

  return (
    <div>
      <div className="grid grid-cols-7 overflow-hidden">
        {WEEK_DAYS.map(day => (
          <div key={day} className="flex items-center justify-center py-2">
            <span className="text-muted-foreground text-xs font-medium">
              {day}
            </span>
          </div>
        ))}
        {cells.map(cell => (
          <DayCell
            key={cell.date.toISOString()}
            cell={cell}
            events={allEvents}
            eventPositions={eventPositions}
          />
        ))}
      </div>

      <div className="bg-calendar-disabled-hour bg-muted/20 h-5 border-t border-b" />
    </div>
  )
}

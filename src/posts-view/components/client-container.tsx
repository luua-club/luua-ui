import { isSameDay, parseISO } from 'date-fns'
import { useMemo } from 'react'

import { useCalendar } from '../contexts/calendar-context'
import { CalendarHeader } from './header/calendar-header'
import { CalendarMonthView } from './month-view/calendar-month-view'

export function ClientContainer() {
  const {
    selectedDate,
    selectedUserId,
    selectedChannel,
    selectedStatus,
    events,
  } = useCalendar()

  const filteredEvents = useMemo(() => {
    const monthStart = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    )
    const monthEnd = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    )

    return events.filter(event => {
      const eventStartDate = parseISO(event.startDate)
      const eventEndDate = parseISO(event.endDate)
      const isInSelectedMonth =
        eventStartDate <= monthEnd && eventEndDate >= monthStart
      const isUserMatch =
        selectedUserId === 'all' || event.user.id === selectedUserId
      const isChannelMatch =
        selectedChannel === 'all' || event.channel === selectedChannel
      const isStatusMatch =
        selectedStatus === 'all' || event.status === selectedStatus
      return isInSelectedMonth && isUserMatch && isChannelMatch && isStatusMatch
    })
  }, [selectedDate, selectedUserId, selectedChannel, selectedStatus, events])

  const singleDayEvents = filteredEvents.filter(event => {
    const startDate = parseISO(event.startDate)
    const endDate = parseISO(event.endDate)
    return isSameDay(startDate, endDate)
  })

  const multiDayEvents = filteredEvents.filter(event => {
    const startDate = parseISO(event.startDate)
    const endDate = parseISO(event.endDate)
    return !isSameDay(startDate, endDate)
  })

  return (
    <div>
      <CalendarHeader events={filteredEvents} />

      <CalendarMonthView
        singleDayEvents={singleDayEvents}
        multiDayEvents={multiDayEvents}
      />
    </div>
  )
}

import { createLazyRoute } from '@tanstack/react-router'
import { Loader } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { ClientContainer } from '../components/client-container'
import { CalendarProvider, useCalendar } from '../contexts/calendar-context'
import useCalendarData from '../hooks/use-calendar-data.hook'

function CalendarContent() {
  const { selectedDate, setLocalEvents } = useCalendar()

  const { events, isLoading } = useCalendarData({
    currentDate: selectedDate,
  })

  const prevEventsRef = useRef<string>('')

  useEffect(() => {
    const serialized = JSON.stringify(events)
    if (serialized !== prevEventsRef.current) {
      prevEventsRef.current = serialized
      setLocalEvents(events)
    }
  }, [events, setLocalEvents])

  if (isLoading && events.length === 0) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <Loader className="size-5 animate-spin" />
      </div>
    )
  }

  return <ClientContainer />
}

function Calendar() {
  return (
    <CalendarProvider users={[]} events={[]}>
      <CalendarContent />
    </CalendarProvider>
  )
}

//--- Lazy Route ---
export const Route = createLazyRoute('/posts-view')({
  component: Calendar,
})

export default Calendar

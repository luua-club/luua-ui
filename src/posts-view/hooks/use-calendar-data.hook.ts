import { useQuery } from '@tanstack/react-query'
import {
  addMinutes,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { useMemo } from 'react'

import { calendarApi } from '@/core/api/calendar.api'
import { QUERY_KEYS } from '@/core/config/constant'
import type { ApiResponse } from '@/core/models/api.model'

import { ICalendarEventsResponse } from '../models/calendar.model'
import { IEvent, IUser } from '../models/interfaces'
import { getEventColor } from '../utils/event-styles'

const DEFAULT_USER: IUser = {
  id: 'current-user',
  name: 'Me',
  picturePath: null,
}

const EVENT_DURATION_MINUTES = 30

interface UseCalendarDataOptions {
  currentDate: Date
}

const useCalendarData = ({ currentDate }: UseCalendarDataOptions) => {
  const { startUtc, endUtc } = useMemo(() => {
    const localStart = startOfWeek(startOfMonth(currentDate))
    const localEnd = endOfWeek(endOfMonth(currentDate))

    return {
      startUtc: localStart.toISOString(),
      endUtc: localEnd.toISOString(),
    }
  }, [currentDate])

  const query = useQuery<ApiResponse<ICalendarEventsResponse>>({
    queryKey: [QUERY_KEYS.calendarEvents, startUtc, endUtc],
    queryFn: () => calendarApi.getEvents({ start: startUtc, end: endUtc }),
    refetchOnMount: 'always',
  })

  const events: IEvent[] = useMemo(() => {
    const raw = query.data?.data?.events ?? []
    return raw.flatMap(e => {
      const displayTime = e.published_at ?? e.scheduled_at
      if (!displayTime) return []
      const displayDate = new Date(displayTime)
      return [
        {
          id: e.id,
          title: e.content.slice(0, 50),
          startDate: displayDate.toISOString(),
          endDate: addMinutes(
            displayDate,
            EVENT_DURATION_MINUTES
          ).toISOString(),
          color: getEventColor(e.status),
          description: `${e.channel} • ${e.status}`,
          channel: e.channel,
          status: e.status,
          user: DEFAULT_USER,
          content: e.content,
          external_id: e.external_id,
          day_total: e.day_total,
        },
      ]
    })
  }, [query.data])

  return {
    events,
    isLoading: query.isPending,
    isError: query.isError,
    users: [DEFAULT_USER],
  }
}

export default useCalendarData

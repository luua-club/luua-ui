import type { Dispatch, SetStateAction } from 'react'
import { createContext, useContext, useState } from 'react'

import type { postStatusType } from '@/core/models/post.model'
import type { channelType } from '@/core/models/social.model'

import { IEvent, IUser } from '../models/interfaces'
import { TBadgeVariant } from '../models/types'

interface ICalendarContext {
  selectedDate: Date
  setSelectedDate: (date: Date | undefined) => void
  selectedUserId: IUser['id'] | 'all'
  setSelectedUserId: (userId: IUser['id'] | 'all') => void
  selectedChannel: channelType | 'all'
  setSelectedChannel: (channel: channelType | 'all') => void
  selectedStatus: postStatusType | 'all'
  setSelectedStatus: (status: postStatusType | 'all') => void
  badgeVariant: TBadgeVariant
  setBadgeVariant: (variant: TBadgeVariant) => void
  users: IUser[]
  events: IEvent[]
  setLocalEvents: Dispatch<SetStateAction<IEvent[]>>
}

const CalendarContext = createContext({} as ICalendarContext)

export function CalendarProvider({
  children,
  users,
  events,
}: {
  children: React.ReactNode
  users: IUser[]
  events: IEvent[]
}) {
  const [badgeVariant, setBadgeVariant] = useState<TBadgeVariant>('colored')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedUserId, setSelectedUserId] = useState<IUser['id'] | 'all'>(
    'all'
  )
  const [selectedChannel, setSelectedChannel] = useState<channelType | 'all'>(
    'all'
  )
  const [selectedStatus, setSelectedStatus] = useState<postStatusType | 'all'>(
    'all'
  )
  const [localEvents, setLocalEvents] = useState<IEvent[]>(events)

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return
    setSelectedDate(date)
  }

  return (
    <CalendarContext.Provider
      value={{
        selectedDate,
        setSelectedDate: handleSelectDate,
        selectedUserId,
        setSelectedUserId,
        selectedChannel,
        setSelectedChannel,
        selectedStatus,
        setSelectedStatus,
        badgeVariant,
        setBadgeVariant,
        users,
        events: localEvents,
        setLocalEvents,
      }}
    >
      {children}
    </CalendarContext.Provider>
  )
}

export function useCalendar(): ICalendarContext {
  const context = useContext(CalendarContext)
  if (!context)
    throw new Error('useCalendar must be used within a CalendarProvider.')
  return context
}

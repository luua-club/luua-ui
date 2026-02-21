import type { postStatusType } from '@/core/models/post.model'

import { TEventColor } from './types'

export interface IUser {
  id: string
  name: string
  picturePath: string | null
}

export interface IEvent {
  id: string
  startDate: string
  endDate: string
  title: string
  color: TEventColor
  description: string
  channel: string
  status: postStatusType
  user: IUser
  content: string
  external_id: string | null
  day_total: number
}

export interface ICalendarCell {
  day: number
  currentMonth: boolean
  date: Date
}

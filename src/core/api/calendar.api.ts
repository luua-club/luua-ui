import {
  ICalendarEventsRequest,
  ICalendarEventsResponse,
} from '@/posts-view/models/calendar.model'

import { BaseApiService } from './base.api'

class CalendarApi extends BaseApiService {
  constructor() {
    super('/calendar')
  }

  async getEvents(req: ICalendarEventsRequest) {
    return this.get<ICalendarEventsResponse>('/events', {
      params: req,
    })
  }
}

export const calendarApi = new CalendarApi()

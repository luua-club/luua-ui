import type { postStatusType } from '@/core/models/post.model'

import { TEventColor } from '../models/types'

export const getEventColor = (status: postStatusType): TEventColor => {
  switch (status) {
    case 'Scheduled':
      return 'blue'
    case 'Published':
      return 'green'
    case 'Failed':
      return 'red'
    case 'Queued':
      return 'yellow'
    default:
      return 'gray'
  }
}

import { DEFAULT_TIME_SLOT_INTERVAL } from '../constant'

export enum TimeSlotInterval {
  Fifteen = 15,
  Thirty = 30,
  Sixty = 60,
}

export const getTimeSlots = (
  interval: TimeSlotInterval = DEFAULT_TIME_SLOT_INTERVAL
): string[] => {
  const slots: string[] = []
  const totalMinutesInDay = 24 * 60

  for (let minutes = 0; minutes < totalMinutesInDay; minutes += interval) {
    const hour = Math.floor(minutes / 60)
    const minute = minutes % 60
    slots.push(
      `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    )
  }
  return slots
}

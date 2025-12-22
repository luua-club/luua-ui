import {
  addYears,
  endOfYear,
  isAfter,
  isSameDay,
  set,
  startOfToday,
} from 'date-fns'
import * as React from 'react'

import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { Card, CardContent } from '../ui/card'
import { getTimeSlots } from '../utils/time.util'

export function SchedulePicker({
  onChange,
}: {
  onChange?: (value: { date: Date; time: string }) => void
}) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null)

  // Use shared utility to generate time slots (interval configurable via DEFAULT_TIME_SLOT_INTERVAL)
  const timeSlots = React.useMemo(() => getTimeSlots(), [])

  const today = startOfToday()
  const fromMonth = today
  // Allow scheduling only till the end of next year (current year + 1)
  const toMonth = endOfYear(addYears(today, 1))

  const parseTime = (time: string, baseDate: Date) => {
    const [h, m] = time.split(':').map(Number)
    return set(baseDate, { hours: h, minutes: m, seconds: 0, milliseconds: 0 })
  }

  // Determine if a time slot should be disabled (only past times on today)
  const isSlotDisabled = (time: string) => {
    if (!date) return true
    // Disallow any time if selected date is beyond allowed max
    if (isAfter(date, toMonth)) return true
    const now = new Date()
    if (!isSameDay(date, now)) return false
    const slotDate = parseTime(time, date)
    return !isAfter(slotDate, now)
  }

  // Auto-select the first available slot strictly after now when date is today,
  // otherwise select the earliest slot.
  React.useEffect(() => {
    if (!date) return
    const now = new Date()
    // If user already selected a valid slot, keep it
    if (selectedTime) {
      if (!isSameDay(date, now)) return
      const selectedDt = parseTime(selectedTime, date)
      if (selectedDt > now) return
    }
    // Otherwise pick the next available
    const next = isSameDay(date, now)
      ? (timeSlots.find(t => isAfter(parseTime(t, date), now)) ?? null)
      : (timeSlots[0] ?? null)
    setSelectedTime(next)
  }, [date, selectedTime, timeSlots])

  // Emit selection to parent whenever both are set
  React.useEffect(() => {
    if (date && selectedTime && onChange) {
      onChange({ date, time: selectedTime })
    }
  }, [date, selectedTime, onChange])

  return (
    <Card className="gap-0 p-0 shadow-none">
      <CardContent className="relative p-0 md:pr-48">
        <div className="p-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            defaultMonth={date}
            captionLayout="dropdown"
            startMonth={fromMonth}
            endMonth={toMonth}
            disabled={[{ before: startOfToday() }, { after: toMonth }]}
            showOutsideDays={false}
            className="bg-transparent p-0 [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
            formatters={{
              formatWeekdayName: date => {
                return date.toLocaleString('en-US', { weekday: 'short' })
              },
            }}
          />
        </div>
        <div className="inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-48 md:border-t-0 md:border-l">
          <div className="grid gap-2">
            {timeSlots.map(time => (
              <Button
                key={time}
                variant={selectedTime === time ? 'default' : 'outline'}
                onClick={() => setSelectedTime(time)}
                disabled={isSlotDisabled(time)}
                className="w-full shadow-none"
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

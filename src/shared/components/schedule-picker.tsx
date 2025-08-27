import {
  addYears,
  format,
  isAfter,
  isSameDay,
  set,
  startOfToday,
} from 'date-fns'
import { Calendar1, Loader2 } from 'lucide-react'
import * as React from 'react'

import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { Card, CardContent, CardFooter } from '../ui/card'
import { getTimeSlots } from '../utils/time'

export function SchedulePicker({
  onChange,
  onSubmit,
  isLoading,
}: {
  onChange?: (value: { date: Date; time: string }) => void
  onSubmit?: (value: { date: Date; time: string }) => void
  isLoading?: boolean
}) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null)

  // Use shared utility to generate time slots (interval configurable via DEFAULT_TIME_SLOT_INTERVAL)
  const timeSlots = React.useMemo(() => getTimeSlots(), [])

  const today = startOfToday()
  const fromMonth = today
  const toMonth = addYears(today, 5)

  const parseTime = (time: string, baseDate: Date) => {
    const [h, m] = time.split(':').map(Number)
    return set(baseDate, { hours: h, minutes: m, seconds: 0, milliseconds: 0 })
  }

  // Determine if a time slot should be disabled (only past times on today)
  const isSlotDisabled = (time: string) => {
    if (!date) return true
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
            disabled={[{ before: startOfToday() }]}
            showOutsideDays={false}
            className="bg-transparent p-0 [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
            formatters={{
              formatWeekdayName: date => {
                return date.toLocaleString('en-US', { weekday: 'short' })
              },
            }}
          />
        </div>
        <div className="no-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-48 md:border-t-0 md:border-l">
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
      <CardFooter className="flex flex-col gap-4 border-t px-6 !py-5 md:flex-row">
        <div className="text-sm">
          {date && selectedTime ? (
            <>
              Post will be scheduled on
              <span className="font-semibold">
                {' '}
                {date?.toLocaleDateString('en-US', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}{' '}
              </span>
              at{' '}
              <span className="font-semibold">
                {selectedTime
                  ? selectedTime
                  : date
                    ? format(date, 'HH:mm')
                    : ''}
              </span>
              .
            </>
          ) : (
            <>Select a date and time for your meeting.</>
          )}
        </div>
        <Button
          disabled={!date || !selectedTime || isLoading}
          className="w-full md:ml-auto md:w-auto"
          variant="brandAccent"
          onClick={() => onSubmit?.({ date: date!, time: selectedTime! })}
        >
          {isLoading ? (
            <Loader2 className="mr-2 animate-spin" />
          ) : (
            <Calendar1 />
          )}
          Schedule
        </Button>
      </CardFooter>
    </Card>
  )
}

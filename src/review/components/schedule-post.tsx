import { SchedulePicker } from '@/shared/components/schedule-picker'

interface SchedulePostProps {
  setSelectedUTCDate: (utc: string) => void
}

function SchedulePost({ setSelectedUTCDate }: SchedulePostProps) {
  return (
    <div className="w-min">
      <SchedulePicker
        onChange={data => {
          const [h, m] = data.time.split(':').map(Number)
          const merged = new Date(data.date)
          merged.setHours(h, m, 0, 0)
          const utc = merged.toISOString()
          setSelectedUTCDate(utc)
        }}
      />
    </div>
  )
}

export default SchedulePost

import { createLazyRoute } from '@tanstack/react-router'

import Post, { PostSkeleton } from '@/core/components/Post'

import ScheduleCalendar from '../components/ScheduleCalendar'
import useScheduleList from '../hooks/schedule-list.hook'

const Schedule = () => {
  const {
    isPending,
    selectedRange,
    setSelectedRange,
    groupedByHour,
    orderedHours,
    formatHour,
    formatSelectedRange,
  } = useScheduleList()

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 p-5 lg:flex-row">
      <ScheduleCalendar
        selectedRange={selectedRange}
        setSelectedRange={setSelectedRange}
      />
      <div className="flex-2">
        <div className="flex items-end justify-between pb-2">
          <h1 className="text-xl font-medium">Scheduled Posts</h1>
          <p className="text-base font-semibold text-gray-500">
            {formatSelectedRange()}
          </p>
        </div>
        <div className="mt-2 space-y-6">
          {isPending ? (
            <PostSkeleton tileView />
          ) : (
            orderedHours.map(h => (
              <div
                key={h}
                className="space-y-3 rounded-lg border-1 border-dashed p-2"
              >
                <h3 className="text-base font-semibold text-gray-500">
                  {formatHour(h)}
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {groupedByHour[h].map(post => (
                    <Post key={post.id} tileView {...post} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex-1"></div>
    </div>
  )
}

export const Route = createLazyRoute('/schedule')({
  component: Schedule,
})

export default Schedule

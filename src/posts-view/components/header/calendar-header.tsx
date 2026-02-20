import { Link } from '@tanstack/react-router'
import { Plus, X } from 'lucide-react'

import { useCalendar } from '@/posts-view/contexts/calendar-context'
import { IEvent } from '@/posts-view/models/interfaces'
import { Button } from '@/shared/ui/button'

import { DateNavigator } from './date-navigator'
import { SocialFilter } from './social-filter'
import { StatusFilter } from './status-filter'
import { TodayButton } from './today-button'

function ClearFiltersButton() {
  const {
    selectedStatus,
    selectedChannel,
    setSelectedStatus,
    setSelectedChannel,
  } = useCalendar()
  const hasFilters = selectedStatus !== 'all' || selectedChannel !== 'all'

  if (!hasFilters) return null

  return (
    <Button
      variant="secondary"
      size={'sm'}
      className="h-7 rounded-full text-xs"
      onClick={() => {
        setSelectedStatus('all')
        setSelectedChannel('all')
      }}
    >
      <X className="size-2.5" />
      Clear
    </Button>
  )
}

interface IProps {
  events: IEvent[]
}

export function CalendarHeader({ events }: IProps) {
  return (
    <div className="bg-background sticky top-0 z-30 flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex items-center gap-3">
        <TodayButton />
        <DateNavigator events={events} />
      </div>
      <div className="flex items-center gap-3">
        <ClearFiltersButton />
        <StatusFilter />
        <SocialFilter />
        <Link
          to="/creation/create"
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-9 cursor-pointer items-center gap-1.5 rounded-sm px-3 text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create
        </Link>
      </div>
    </div>
  )
}

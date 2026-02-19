import { endOfDay, format, isSameDay, parseISO, startOfDay } from 'date-fns'
import { CheckCircle, Clock, Loader, XCircle } from 'lucide-react'

import { SOCIAL_PLATFORM } from '@/core/config/constant'
import type { postStatusType } from '@/core/models/post.model'
import { IEvent } from '@/posts-view/models/interfaces'
import { TEventColor } from '@/posts-view/models/types'
import { cn } from '@/shared/utils/index'

import { EventDetailsDialog } from '../dialogs/event-details-dialog'

// Accent bar colors — match status palette
const EVENT_ACCENT: Record<TEventColor, string> = {
  blue: '#bfdbfe',
  green: '#bffcd9',
  red: '#fecaca',
  yellow: '#fde68a',
  purple: '#e9d5ff',
  orange: '#fed7aa',
  gray: '#e5e7eb',
}

const STATUS_CONFIG: Record<
  postStatusType,
  { label: string; icon: React.ElementType; color: string }
> = {
  Published: { label: 'Published', icon: CheckCircle, color: '#008a2e' },
  Scheduled: { label: 'Scheduled', icon: Clock, color: '#1d4ed8' },
  Queued: { label: 'Queued', icon: Loader, color: '#dc7609' },
  Failed: { label: 'Failed', icon: XCircle, color: '#dc2626' },
}

interface IProps {
  event: IEvent
  cellDate: Date
  eventCurrentDay?: number
  eventTotalDays?: number
  className?: string
  position?: 'first' | 'middle' | 'last' | 'none'
}

export function MonthEventBadge({
  event,
  cellDate,
  eventCurrentDay,
  eventTotalDays,
  className,
  position: propPosition,
}: IProps) {
  const itemStart = startOfDay(parseISO(event.startDate))
  const itemEnd = endOfDay(parseISO(event.endDate))

  if (cellDate < itemStart || cellDate > itemEnd) return null

  let position: 'first' | 'middle' | 'last' | 'none'

  if (propPosition) {
    position = propPosition
  } else if (eventCurrentDay && eventTotalDays) {
    position = 'none'
  } else if (isSameDay(itemStart, itemEnd)) {
    position = 'none'
  } else if (isSameDay(cellDate, itemStart)) {
    position = 'first'
  } else if (isSameDay(cellDate, itemEnd)) {
    position = 'last'
  } else {
    position = 'middle'
  }

  const showContent = ['first', 'none'].includes(position)

  const PlatformLogo = SOCIAL_PLATFORM.find(p => p.name === event.channel)?.logo
  const accentColor = EVENT_ACCENT[event.color] ?? '#D1D5DB'
  const status = STATUS_CONFIG[event.status]

  const positionClass = cn({
    'mr-0 rounded-r-none': position === 'first',
    'mx-0 rounded-none': position === 'middle',
    'ml-0 rounded-l-none': position === 'last',
  })

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (e.currentTarget instanceof HTMLElement) e.currentTarget.click()
    }
  }

  return (
    <EventDetailsDialog event={event}>
      <div
        role="button"
        tabIndex={0}
        className={cn(
          'focus-visible:ring-ring hover:bg-muted/80 relative mx-1 h-11 w-[calc(100%-8px)] cursor-pointer overflow-hidden rounded-xs bg-white shadow-sm ring-1 ring-black/[0.02] transition-all select-none hover:shadow-md focus-visible:ring-2 focus-visible:outline-none dark:bg-neutral-800 dark:ring-white/[0.1] dark:hover:ring-white/[0.18]',
          positionClass,
          className
        )}
        onKeyDown={handleKeyDown}
      >
        {/* Card body */}
        <div className="flex h-full w-full flex-col justify-center gap-0.5 overflow-hidden px-1.5 pt-1 pb-[3px]">
          {/* Row 1 — icon + title */}
          <div className="flex w-full min-w-0 items-center gap-1.5 overflow-hidden">
            {PlatformLogo && (
              <PlatformLogo width={14} height={14} className="shrink-0" />
            )}
            <p
              className="min-w-0 flex-1 truncate text-[10px] font-semibold text-gray-900 dark:text-neutral-100"
              title={event.title}
            >
              {event.title}
            </p>
          </div>

          {/* Row 2 — status (left) + time (right) */}
          {showContent && status && (
            <div className="flex w-full items-center justify-between pl-5">
              <span
                className="flex items-center gap-0.5"
                style={{ color: status.color }}
              >
                <status.icon
                  size={9}
                  strokeWidth={2}
                  className={
                    event.status === 'Queued'
                      ? 'animate-spin [animation-duration:3s]'
                      : undefined
                  }
                />
                <span className="text-[8px] font-medium">{status.label}</span>
              </span>
              <span className="text-[8px] text-gray-600 tabular-nums dark:text-neutral-500">
                {format(new Date(event.startDate), 'h:mm a')}
              </span>
            </div>
          )}
        </div>

        {/* Thin colored accent bar */}
        <div
          className="absolute inset-x-0 bottom-0 h-[2px]"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    </EventDetailsDialog>
  )
}

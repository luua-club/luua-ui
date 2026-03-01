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
  blue: '#60a5fa',
  green: '#34d399',
  red: '#f87171',
  yellow: '#fbbf24',
  purple: '#c084fc',
  orange: '#fb923c',
  gray: '#94a3b8',
}

const STATUS_CONFIG: Record<
  postStatusType,
  {
    label: string
    icon: React.ElementType
    textClass: string
    chipClass: string
  }
> = {
  Published: {
    label: 'Published',
    icon: CheckCircle,
    textClass: 'text-emerald-700 dark:text-emerald-200',
    chipClass: 'border-none',
  },
  Scheduled: {
    label: 'Scheduled',
    icon: Clock,
    textClass: 'text-blue-700 dark:text-blue-200',
    chipClass: 'border-none',
  },
  Queued: {
    label: 'Queued',
    icon: Loader,
    textClass: 'text-amber-700 dark:text-amber-200',
    chipClass: 'border-none',
  },
  Failed: {
    label: 'Failed',
    icon: XCircle,
    textClass: 'text-red-700 dark:text-red-200',
    chipClass: 'border-none',
  },
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
          'bg-card focus-visible:ring-ring hover:bg-accent/50 ring-border relative mx-1 h-11 w-[calc(100%-8px)] cursor-pointer overflow-hidden rounded-sm ring-1 transition-all select-none focus-visible:ring-2 focus-visible:outline-none',
          positionClass,
          className
        )}
        onKeyDown={handleKeyDown}
      >
        {/* Card body */}
        <div className="flex h-full w-full flex-col justify-center gap-0.5 overflow-hidden px-1.5 pt-1 pb-[3px]">
          {/* Row 1 — platform logo + title */}
          <div className="flex w-full min-w-0 items-center gap-1.5 overflow-hidden">
            {PlatformLogo && (
              <PlatformLogo width={14} height={14} className="shrink-0" />
            )}
            <p
              className="text-foreground min-w-0 flex-1 truncate text-[10px] font-semibold"
              title={event.title}
            >
              {event.title}
            </p>
          </div>

          {/* Row 2 — status badge (left) + time (right) */}
          {showContent && status && (
            <div className="flex w-full items-center justify-between pl-3">
              <span
                className={cn(
                  'inline-flex shrink-0 items-center gap-0.5 rounded-sm border px-1 py-[1px]',
                  status.chipClass,
                  status.textClass
                )}
              >
                <status.icon
                  size={10}
                  strokeWidth={2}
                  className={
                    event.status === 'Queued'
                      ? 'animate-spin [animation-duration:3s]'
                      : undefined
                  }
                />
                <span className="hidden text-[9px] leading-none font-semibold xl:inline">
                  {status.label}
                </span>
              </span>
              <span className="text-foreground/70 dark:text-foreground/90 dark:bg-muted/45 rounded-sm px-1 py-[1px] text-[9px] font-semibold tabular-nums">
                {format(new Date(event.startDate), 'h:mm a')}
              </span>
            </div>
          )}
        </div>

        {/* Bottom colored accent bar */}
        <div
          className="absolute inset-x-0 bottom-0 h-[2px]"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    </EventDetailsDialog>
  )
}

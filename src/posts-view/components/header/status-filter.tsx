import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Hourglass,
  XCircle,
} from 'lucide-react'
import { useState } from 'react'

import type { postStatusType } from '@/core/models/post.model'
import { useCalendar } from '@/posts-view/contexts/calendar-context'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { cn } from '@/shared/utils'

type StatusOption = {
  value: postStatusType
  label: string
  icon: React.ElementType
  color: string
  bg: string
  ring: string
  dot: string
}

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: 'Scheduled',
    label: 'Scheduled',
    icon: Clock,
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-500/12',
    ring: 'ring-blue-200 dark:ring-blue-500/35',
    dot: 'bg-blue-500 dark:bg-blue-400',
  },
  {
    value: 'Published',
    label: 'Published',
    icon: CheckCircle2,
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-50 dark:bg-emerald-500/12',
    ring: 'ring-emerald-200 dark:ring-emerald-500/35',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
  },
  {
    value: 'Queued',
    label: 'Queued',
    icon: Hourglass,
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-500/12',
    ring: 'ring-amber-200 dark:ring-amber-500/35',
    dot: 'bg-amber-500 dark:bg-amber-400',
  },
  {
    value: 'Failed',
    label: 'Failed',
    icon: XCircle,
    color: 'text-red-700 dark:text-red-300',
    bg: 'bg-red-50 dark:bg-red-500/12',
    ring: 'ring-red-200 dark:ring-red-500/35',
    dot: 'bg-red-500 dark:bg-red-400',
  },
]

export function StatusFilter() {
  const { selectedStatus, setSelectedStatus } = useCalendar()
  const [open, setOpen] = useState(false)

  const active = STATUS_OPTIONS.find(s => s.value === selectedStatus) ?? null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="bg-background text-foreground hover:bg-accent/40 flex h-9 cursor-pointer items-center gap-2 rounded-sm border px-3 shadow-xs transition-colors">
          {active ? (
            <span className={`h-2 w-2 shrink-0 rounded-full ${active.dot}`} />
          ) : (
            <span className="flex gap-0.5">
              {STATUS_OPTIONS.map(s => (
                <span
                  key={s.value}
                  className={`h-1.5 w-1.5 rounded-full ${s.dot}`}
                />
              ))}
            </span>
          )}
          <span className="text-foreground text-sm font-medium">
            {active ? active.label : 'Status'}
          </span>
          <ChevronDown className="text-muted-foreground h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="bg-popover text-popover-foreground w-56 border p-2 shadow-lg"
        align="end"
        sideOffset={6}
      >
        {/* All / reset row */}
        <button
          onClick={() => {
            setSelectedStatus('all')
            setOpen(false)
          }}
          className={`mb-2 flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
            selectedStatus === 'all'
              ? 'bg-accent font-semibold'
              : 'text-muted-foreground hover:bg-accent/60'
          }`}
        >
          <span className="flex gap-0.5">
            {STATUS_OPTIONS.map(s => (
              <span
                key={s.value}
                className={`h-1.5 w-1.5 rounded-full ${s.dot}`}
              />
            ))}
          </span>
          All statuses
        </button>

        <div className="grid grid-cols-2 gap-1.5">
          {STATUS_OPTIONS.map(option => {
            const Icon = option.icon
            const isSelected = selectedStatus === option.value
            return (
              <button
                key={option.value}
                onClick={() => {
                  setSelectedStatus(isSelected ? 'all' : option.value)
                  setOpen(false)
                }}
                className={cn(
                  'group flex cursor-pointer flex-col items-start gap-1.5 rounded-lg p-2.5 ring-1 transition-all',
                  option.bg,
                  isSelected ? ['ring-2', option.ring] : option.ring
                )}
              >
                <Icon
                  className={`h-4 w-4 ${option.color} ${isSelected ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}
                />
                <span
                  className={cn(
                    'text-foreground text-xs leading-none font-medium',
                    isSelected ? option.color : 'opacity-85'
                  )}
                >
                  {option.label}
                </span>
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

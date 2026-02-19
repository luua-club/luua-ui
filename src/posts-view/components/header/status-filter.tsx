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
    color: 'text-[#1d4ed8]',
    bg: 'bg-[#eff6ff]',
    ring: 'ring-[#bfdbfe]',
    dot: 'bg-[#3b82f6]',
  },
  {
    value: 'Published',
    label: 'Published',
    icon: CheckCircle2,
    color: 'text-[#008a2e]',
    bg: 'bg-[#ecfdf3]',
    ring: 'ring-[#bffcd9]',
    dot: 'bg-[#22c55e]',
  },
  {
    value: 'Queued',
    label: 'Queued',
    icon: Hourglass,
    color: 'text-[#dc7609]',
    bg: 'bg-[#fffcf0]',
    ring: 'ring-[#fbeeb1]',
    dot: 'bg-[#f59e0b]',
  },
  {
    value: 'Failed',
    label: 'Failed',
    icon: XCircle,
    color: 'text-[#dc2626]',
    bg: 'bg-[#fef2f2]',
    ring: 'ring-[#fecaca]',
    dot: 'bg-[#ef4444]',
  },
]

export function StatusFilter() {
  const { selectedStatus, setSelectedStatus } = useCalendar()
  const [open, setOpen] = useState(false)

  const active = STATUS_OPTIONS.find(s => s.value === selectedStatus) ?? null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex h-9 cursor-pointer items-center gap-2 rounded-sm border-1 px-3 shadow-xs transition-colors">
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

      <PopoverContent className="w-56 p-2" align="end" sideOffset={6}>
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
                className={`group flex cursor-pointer flex-col items-start gap-1.5 rounded-lg p-2.5 ring-1 transition-all ${option.bg} ${
                  isSelected
                    ? `${option.ring} ring-2`
                    : 'hover: ring-transparent hover:ring-1' + option.ring
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${option.color} ${isSelected ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}
                />
                <span
                  className={`text-xs leading-none font-medium ${isSelected ? option.color : 'text-foreground/70 group-hover:text-foreground'}`}
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

import {
  ALL_EVENT_TYPES,
  AuditCategory,
  CATEGORY_LABEL,
  EVENT_CATEGORY,
  EVENT_LABEL,
} from '@/core/models/audit-log.model'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'

const CATEGORIES: AuditCategory[] = [
  'all',
  'content',
  'publishing',
  'team',
  'autopilot',
  'inspirations',
  'settings',
  'billing',
  'social',
]

interface AuditLogFiltersProps {
  category: AuditCategory
  eventType: string | 'all'
  onCategoryChange: (category: AuditCategory) => void
  onEventTypeChange: (eventType: string | 'all') => void
}

function AuditLogFilters({
  category,
  eventType,
  onCategoryChange,
  onEventTypeChange,
}: AuditLogFiltersProps) {
  const visibleEvents = ALL_EVENT_TYPES.filter(
    e => category === 'all' || EVENT_CATEGORY[e] === category
  )

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={category}
        onValueChange={v => onCategoryChange(v as AuditCategory)}
      >
        <SelectTrigger className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map(c => (
            <SelectItem key={c} value={c}>
              {CATEGORY_LABEL[c]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={eventType} onValueChange={onEventTypeChange}>
        <SelectTrigger className="w-56">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All events</SelectItem>
          {visibleEvents.map(e => (
            <SelectItem key={e} value={e}>
              {EVENT_LABEL[e]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default AuditLogFilters

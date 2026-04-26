import {
  AuditCategory,
  AuditEventType,
  EVENT_CATEGORY,
  EVENT_LABEL,
} from '@/core/models/audit-log.model'

export function humanizeEventType(eventType: string): string {
  if (eventType in EVENT_LABEL) {
    return EVENT_LABEL[eventType as AuditEventType]
  }
  return eventType
    .split('.')
    .map(part => part.replace(/_/g, ' '))
    .join(' — ')
    .replace(/^./, c => c.toUpperCase())
}

export function getCategoryForEvent(eventType: string): AuditCategory {
  if (eventType in EVENT_CATEGORY) {
    return EVENT_CATEGORY[eventType as AuditEventType]
  }
  return 'settings'
}

const RELATIVE_DIVISIONS: Array<{
  amount: number
  unit: Intl.RelativeTimeFormatUnit
}> = [
  { amount: 60, unit: 'second' },
  { amount: 60, unit: 'minute' },
  { amount: 24, unit: 'hour' },
  { amount: 7, unit: 'day' },
  { amount: 4.34524, unit: 'week' },
  { amount: 12, unit: 'month' },
  { amount: Number.POSITIVE_INFINITY, unit: 'year' },
]

const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return dateStr
  let duration = (date.getTime() - Date.now()) / 1000
  for (const division of RELATIVE_DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.unit)
    }
    duration /= division.amount
  }
  return dateStr
}

export function formatAbsoluteTime(dateStr: string): string {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return dateStr
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function extractEmailInitial(email?: string | null): string {
  if (!email) return '?'
  return email.charAt(0).toUpperCase()
}

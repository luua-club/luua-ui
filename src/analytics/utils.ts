import { format } from 'date-fns'

import { type IAnalyticsPost } from '@/core/models/analytics.model'

export const ACTIVITY_WEEKS = 52

export function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function toDateKey(value: string | null | undefined) {
  if (!value) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return format(date, 'yyyy-MM-dd')
}

export function metricValue(value: number | null | undefined) {
  return Number.isFinite(value) ? Number(value) : 0
}

export function commonEngagement(post: IAnalyticsPost) {
  return (
    metricValue(post.latest_metrics?.likes) +
    metricValue(post.latest_metrics?.comments)
  )
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en', {
    notation: value >= 10_000 ? 'compact' : 'standard',
    maximumFractionDigits: value >= 10_000 ? 1 : 0,
  }).format(value)
}

export function formatChange(value: number | null) {
  if (value === null || !Number.isFinite(value)) return null
  return `${Math.abs(value).toFixed(1)}%`
}

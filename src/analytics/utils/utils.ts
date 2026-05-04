import { format } from 'date-fns'

import { type IAnalyticsPost } from '@/core/models/analytics.model'

/**
 * Normalize an API date/datetime into the `YYYY-MM-DD` key used by trend data.
 * Returns `null` for missing or invalid values so callers can choose a fallback.
 */
export function toDateKey(value: string | null | undefined) {
  if (!value) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return format(date, 'yyyy-MM-dd')
}

/**
 * Read a numeric metric safely from optional analytics payloads.
 * Missing, null, and non-finite values should render as zero in the UI.
 */
export function metricValue(value: number | null | undefined) {
  return Number.isFinite(value) ? Number(value) : 0
}

/**
 * Common cross-platform engagement is intentionally limited to likes + comments.
 * These are the metrics both LinkedIn and X/Twitter can provide consistently.
 */
export function commonEngagement(post: IAnalyticsPost) {
  return (
    metricValue(post.latest_metrics?.likes) +
    metricValue(post.latest_metrics?.comments)
  )
}

/**
 * Compact analytics numbers for card/table display.
 * Examples: `7,485`, `14.2k`, `1.1M`.
 */
export function formatNumber(value: number) {
  return new Intl.NumberFormat('en', {
    notation: value >= 10_000 ? 'compact' : 'standard',
    maximumFractionDigits: value >= 10_000 ? 1 : 0,
  }).format(value)
}

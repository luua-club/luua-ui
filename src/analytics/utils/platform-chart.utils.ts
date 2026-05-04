import { format } from 'date-fns'

import {
  getSocialPlatformChartColor,
  getSocialPlatformLabel,
} from '@/core/utils/social.utils'
import { type ChartConfig } from '@/shared/ui/chart'

export type PlatformChartColors = {
  LinkedIn: string
  Twitter: string
}

type PlatformValuePoint = {
  channel: 'LinkedIn' | 'Twitter'
  value?: number
  count?: number
}

/**
 * Build the shadcn chart config for the two supported analytics platforms.
 * Keeps chart labels/colors sourced from the official social platform config.
 */
export function createPlatformChartConfig(colors: PlatformChartColors) {
  return {
    LinkedIn: {
      label: 'LinkedIn',
      color: colors.LinkedIn,
    },
    Twitter: {
      label: getSocialPlatformLabel('Twitter'),
      color: colors.Twitter,
    },
  } satisfies ChartConfig
}

/**
 * Resolve platform chart colors for the current theme.
 * Components pass only the active theme; this helper owns light/dark mapping.
 */
export function getPlatformChartColors(theme: string): PlatformChartColors {
  const mode = theme === 'dark' ? 'dark' : 'light'

  return {
    LinkedIn: getSocialPlatformChartColor('LinkedIn', mode),
    Twitter: getSocialPlatformChartColor('Twitter', mode),
  }
}

/**
 * Format backend `YYYY-MM-DD` trend keys into compact axis labels.
 * Uses local date construction to avoid UTC timezone shifting the calendar day.
 */
export function toDateLabel(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)

  return format(new Date(year, month - 1, day), 'MMM d')
}

/**
 * Read either `value` or `count` from a channel aggregate.
 * Backend breakdown responses use both shapes for interaction and post counts.
 */
export function channelValue(
  points: PlatformValuePoint[],
  channel: 'LinkedIn' | 'Twitter'
) {
  const point = points.find(item => item.channel === channel)

  return point?.value ?? point?.count ?? 0
}

/**
 * Create the tiny two-row dataset used by platform bar/donut charts.
 * `valueKey` lets each chart name its metric without duplicating mapping code.
 */
export function makePlatformChartData({
  LinkedIn,
  Twitter,
  valueKey,
}: {
  LinkedIn: number
  Twitter: number
  valueKey: string
}) {
  return [
    {
      channel: 'LinkedIn',
      [valueKey]: LinkedIn,
      fill: 'var(--color-LinkedIn)',
    },
    {
      channel: 'Twitter',
      [valueKey]: Twitter,
      fill: 'var(--color-Twitter)',
    },
  ]
}

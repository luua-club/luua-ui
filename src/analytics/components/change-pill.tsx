import { cn } from '@/shared/utils'

import { formatChange } from '../utils'

export default function ChangePill({ value }: { value: number | null }) {
  if (value === null) return null

  const formatted = formatChange(value)
  if (!formatted) return null

  const isPositive = value >= 0

  return (
    <span
      className={cn(
        'rounded border px-3 py-1 text-sm leading-none font-semibold',
        isPositive
          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400'
          : 'border-red-500/20 bg-red-500/10 text-red-600 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-400'
      )}
    >
      {isPositive ? '+' : '-'}
      {formatted}
    </span>
  )
}

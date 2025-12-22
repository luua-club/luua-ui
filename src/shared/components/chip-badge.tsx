import { Badge } from '../ui/badge'
import { cn } from '../utils'

interface ChipBadgeProps {
  variant: 'hot' | 'cold' | 'stale' | 'nature'
  children: React.ReactNode
  className?: string
}

function ChipBadge({ children, variant, className }: ChipBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'rounded-xs font-semibold',
        className,
        variant === 'hot' &&
          'border-orange-600 text-orange-600 dark:border-orange-400 dark:text-orange-400',
        variant === 'cold' &&
          'border-cyan-600 text-cyan-600 dark:border-cyan-400 dark:text-cyan-400',
        variant === 'nature' &&
          'border-green-600 text-green-600 dark:border-green-400 dark:text-green-400',
        variant === 'stale' &&
          'border-gray-300 text-gray-500 dark:border-gray-500 dark:text-gray-500'
      )}
    >
      {children}
    </Badge>
  )
}

export default ChipBadge

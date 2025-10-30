import { Badge } from '../ui/badge'
import { cn } from '../utils'

interface ChipBadgeProps {
  variant: 'hot' | 'cold'
  children: React.ReactNode
}

function ChipBadge({ children, variant }: ChipBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'rounded-xs font-semibold',
        variant === 'hot' &&
          'border-orange-600 text-orange-600 dark:border-orange-400 dark:text-orange-400',
        variant === 'cold' &&
          'border-cyan-600 text-cyan-600 dark:border-cyan-400 dark:text-cyan-400'
      )}
    >
      {children}
    </Badge>
  )
}

export default ChipBadge

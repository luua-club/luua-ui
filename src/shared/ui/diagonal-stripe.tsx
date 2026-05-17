import { cn } from '@/shared/utils/index'

interface DiagonalStripeProps {
  className?: string
  backgroundColor?: string
}

export function DiagonalStripe({
  className,
  backgroundColor = 'transparent',
}: DiagonalStripeProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none border-x-2 border-dashed border-neutral-200 dark:border-neutral-700',
        '[--stripe-color:rgba(0,0,0,0.06)] dark:[--stripe-color:rgba(255,255,255,0.08)]',
        className
      )}
      style={{
        backgroundColor,
        backgroundImage:
          'repeating-linear-gradient(135deg, var(--stripe-color, rgba(0,0,0,0.08)) 0 1px, transparent 1px 12px)',
      }}
    />
  )
}

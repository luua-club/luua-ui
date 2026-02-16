import { cn } from '@/shared/utils/index'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'bg-accent relative overflow-hidden rounded-md',
        'before:animate-shimmer before:absolute before:inset-0 before:bg-[linear-gradient(90deg,transparent_25%,var(--color-foreground)/8%_50%,transparent_75%)] before:bg-[length:200%_100%]',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }

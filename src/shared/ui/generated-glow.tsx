import { cn } from '@/shared/utils'

interface GeneratedGlowProps {
  /** Show the shimmer border while true (e.g. while AI is generating) */
  active: boolean
  children: React.ReactNode
  className?: string
}

/**
 * Wraps a card with a continuous purple-orange shimmer border while `active`.
 * The shimmer fades in/out smoothly via CSS transition — no JS animation needed.
 *
 * The glow div sits behind the card (`-z-10`) and extends 1.5px outside
 * (`-inset-[1.5px]`), so the card's own background covers the center and
 * only the rim is visible. `isolate` scopes the z-index to this wrapper.
 *
 * Pass the card's border-radius class (e.g. `className="rounded-md"`).
 */
export function GeneratedGlow({
  active,
  children,
  className,
}: GeneratedGlowProps) {
  return (
    <div className={cn('relative isolate', className)}>
      {children}

      <div
        className={cn(
          'animate-shimmer pointer-events-none absolute -inset-[1.5px] -z-10 transition-opacity duration-500',
          active ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          borderRadius: 'inherit',
          background:
            'linear-gradient(90deg, #a855f7, #f97316, #ec4899, #a855f7)',
          backgroundSize: '200% 100%',
        }}
      />
    </div>
  )
}

import { AnimatedGradientText } from '../ui/animated-gradient-text'
import { cn } from '../utils'

interface IProPlanChipProps {
  className?: string
  onClick?: () => void
  children?: React.ReactNode
}

export function ProPlanChip({
  className,
  onClick,
  children,
}: IProPlanChipProps) {
  return (
    <div
      className="group relative flex cursor-pointer overflow-hidden rounded-xs"
      onClick={onClick}
    >
      <div className="animate-gradient absolute inset-0 bg-gradient-to-r from-green-500/50 via-purple-600/50 to-green-500/50 bg-[length:300%_100%]" />
      <div className="bg-card relative m-[1px] flex items-center justify-center rounded-[calc(theme(borderRadius.xs)-1px)] px-3 py-0.5 shadow-[inset_0_-8px_10px_#22c55e1f] transition-shadow duration-500 ease-out group-hover:shadow-[inset_0_-5px_10px_#22c55e3f]">
        <AnimatedGradientText
          className={cn('text-xs font-medium', className)}
          colorFrom="#22c55e"
          colorTo="#9333ea"
        >
          {children || 'PRO'}
        </AnimatedGradientText>
      </div>
    </div>
  )
}

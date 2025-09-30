import { AnimatedGradientText } from '../ui/animated-gradient-text'

export function ProPlanChip() {
  return (
    <div className="group relative flex overflow-hidden rounded-xs">
      <div className="animate-gradient absolute inset-0 bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%]" />
      <div className="bg-card relative m-[1px] flex items-center justify-center rounded-[calc(theme(borderRadius.xs)-1px)] px-3 py-0.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out group-hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
        <AnimatedGradientText className="text-xs font-medium">
          PRO
        </AnimatedGradientText>
      </div>
    </div>
  )
}

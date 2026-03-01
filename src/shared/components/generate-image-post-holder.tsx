import { Sparkles } from 'lucide-react'

import { AnimatedGradientText } from '../ui/animated-gradient-text'

interface GenerateImagePostHolderProps {
  handleOnClick: () => void
}

function GenerateImagePostHolder({
  handleOnClick,
}: GenerateImagePostHolderProps) {
  return (
    <div className="bg-muted/80 rounded-md border">
      <button
        className="mb-1 flex w-full items-center justify-center gap-1.5 py-2"
        onClick={handleOnClick}
      >
        <Sparkles className="size-3 text-violet-400" />
        <AnimatedGradientText className="text-xs font-medium">
          Use Luua to generate image →
        </AnimatedGradientText>
      </button>
    </div>
  )
}

export default GenerateImagePostHolder

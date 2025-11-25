import { cn } from '@/shared/utils'

import { AnimatedGradientText } from '../ui/animated-gradient-text'

interface IGradientBtnProps {
  text: string
  classname?: string
  onClick?: () => void
}

function GradientBtn({ onClick, text, classname }: IGradientBtnProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative mx-auto flex cursor-pointer items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]',
        classname
      )}
    >
      <span
        className={cn(
          'animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]'
        )}
        style={{
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'destination-out',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'subtract',
          WebkitClipPath: 'padding-box',
        }}
      />
      <AnimatedGradientText className="text-sm font-medium">
        {text}
      </AnimatedGradientText>
    </div>
  )
}

export default GradientBtn

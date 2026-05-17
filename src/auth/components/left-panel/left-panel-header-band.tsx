import luuaIconLogo from '@/assets/logos/luua-black-icon-logo.svg'
import LuuaBlackTextLogo from '@/assets/logos/luua-black-text-logo.svg'
import luuaWhiteIconLogo from '@/assets/logos/luua-white-icon-logo.svg'
import LuuaWhiteTextLogo from '@/assets/logos/luua-white-text-logo.svg'
import { cn } from '@/shared/utils'

type LeftPanelHeaderBandProps = {
  insetClassName: string
}

export function LeftPanelHeaderBand({
  insetClassName,
}: LeftPanelHeaderBandProps) {
  return (
    <section
      className={cn(
        'border-border relative flex h-[clamp(4rem,12vh,8rem)] shrink-0',
        'items-center justify-center gap-4 border-b lg:justify-start',
        insetClassName
      )}
    >
      <img src={luuaIconLogo} alt="Luua Icon" className="size-8 dark:hidden" />
      <img
        src={luuaWhiteIconLogo}
        alt="Luua Icon"
        className="hidden size-8 dark:block"
      />
      <img src={LuuaBlackTextLogo} alt="Luua" className="h-6 dark:hidden" />
      <img
        src={LuuaWhiteTextLogo}
        alt="Luua"
        className="hidden h-6 dark:block"
      />
    </section>
  )
}

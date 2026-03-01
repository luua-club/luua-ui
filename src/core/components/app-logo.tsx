import LogoIconOnly from '@/assets/logos/luua-black-icon-logo.svg?react'
import LogoTextOnly from '@/assets/logos/luua-black-text-logo.svg?react'
import LogoWhiteIconOnly from '@/assets/logos/luua-white-icon-logo.svg?react'
import LogoWhiteTextOnly from '@/assets/logos/luua-white-text-logo.svg?react'
import { cn } from '@/shared/utils'

/*
 * Used to display only icon in logo, i.e - <turtle-img>
 */
interface AppIconLogoProps {
  className?: string
}
function AppIconLogo({ className }: AppIconLogoProps) {
  return (
    <>
      <LogoIconOnly
        aria-label="Icon"
        className={cn('!size-5 dark:hidden', className)}
      />
      <LogoWhiteIconOnly
        aria-label="Icon"
        className={cn('hidden !size-5 dark:block', className)}
      />
    </>
  )
}

/*
 * Used to display only text in logo, i.e - Luua
 */
interface AppTextLogoProps {
  className?: string
}
function AppTextLogo({ className }: AppTextLogoProps) {
  return (
    <>
      <LogoTextOnly
        aria-label="Text"
        className={cn('!size-12 dark:hidden', className)}
      />

      <LogoWhiteTextOnly
        aria-label="Text"
        className={cn('hidden !size-12 dark:block', className)}
      />
    </>
  )
}

export { AppIconLogo, AppTextLogo }

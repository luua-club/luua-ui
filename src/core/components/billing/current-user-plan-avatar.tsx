import type { ComponentProps } from 'react'

import type { BillingPlan } from '@/core/models/org.model'
import { extractUserInitial } from '@/core/utils/common.util'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { cn } from '@/shared/utils'

type AvatarProps = ComponentProps<typeof Avatar>

const PLAN_BADGE_CLASS: Partial<Record<BillingPlan, string>> = {
  Pro: 'border-amber-300 bg-amber-300 text-black dark:border-amber-500 dark:bg-amber-400',
  Team: 'border-cyan-300 bg-cyan-300 text-black dark:border-cyan-500 dark:bg-cyan-400',
}

interface CurrentUserPlanAvatarProps {
  name: string
  profileImage?: string | null
  plan?: BillingPlan | null
  className?: string
  avatarClassName?: AvatarProps['className']
  fallbackClassName?: string
}

export function CurrentUserPlanAvatar({
  name,
  profileImage,
  plan,
  className,
  avatarClassName,
  fallbackClassName,
}: CurrentUserPlanAvatarProps) {
  const showBadge = plan === 'Pro' || plan === 'Team'

  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      <Avatar className={cn('rounded-full', avatarClassName)}>
        <AvatarImage src={profileImage ?? undefined} alt={name} />
        <AvatarFallback
          className={cn(
            'rounded-full bg-amber-400 font-medium text-black',
            fallbackClassName
          )}
        >
          {extractUserInitial(name)}
        </AvatarFallback>
      </Avatar>

      {showBadge ? (
        <span
          className={cn(
            'absolute -bottom-1 left-1/2 z-10 -translate-x-1/2 rounded-[3px] border px-1 py-px text-[9px] leading-none font-bold shadow-sm',
            PLAN_BADGE_CLASS[plan]
          )}
        >
          {plan}
        </span>
      ) : null}
    </span>
  )
}

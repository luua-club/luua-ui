import type { ComponentProps } from 'react'
import { useMemo } from 'react'

import { BASE_API_URL } from '@/core/config/constant'
import type { BillingPlan } from '@/core/models/org.model'
import { extractUserInitial } from '@/core/utils/common.util'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { cn } from '@/shared/utils'

type AvatarProps = ComponentProps<typeof Avatar>

const PLAN_BADGE_CLASS: Partial<Record<BillingPlan, string>> = {
  Free: 'bg-yellow-300',
  Pro: 'bg-violet-300',
  Team: 'bg-blue-300',
}

interface CurrentUserPlanAvatarProps {
  name: string
  profileImage?: string | null
  plan?: BillingPlan | null
  className?: string
  avatarClassName?: AvatarProps['className']
  fallbackClassName?: string
  showFreeBadge?: boolean
}

export function CurrentUserPlanAvatar({
  name,
  profileImage,
  plan,
  className,
  avatarClassName,
  fallbackClassName,
  showFreeBadge = false,
}: CurrentUserPlanAvatarProps) {
  const showBadge =
    plan === 'Pro' || plan === 'Team' || (showFreeBadge && plan === 'Free')
  const imageSrc = useMemo(
    () => normalizeProfileImageUrl(profileImage),
    [profileImage]
  )

  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      <Avatar className={cn('rounded-full', avatarClassName)}>
        {imageSrc ? (
          <AvatarImage src={imageSrc} alt={name} className="object-cover" />
        ) : null}
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
            'absolute -bottom-[5px] left-1/2 z-10 -translate-x-1/2 overflow-hidden rounded-[3px] border px-1 py-px text-[8px] leading-none font-bold shadow-sm',
            PLAN_BADGE_CLASS[plan],
            'border-gray-500 font-medium dark:text-black'
          )}
        >
          <span className="relative z-10">{plan}</span>
        </span>
      ) : null}
    </span>
  )
}

function normalizeProfileImageUrl(value?: string | null) {
  const trimmed = value?.trim()

  if (!trimmed) return undefined
  if (/^(https?:|data:|blob:)/i.test(trimmed)) return trimmed
  if (trimmed.startsWith('//')) {
    return `${window.location.protocol}${trimmed}`
  }
  if (isHostLikeUrl(trimmed)) return `https://${trimmed}`

  try {
    return new URL(trimmed, getBackendOrigin()).toString()
  } catch {
    return trimmed
  }
}

function isHostLikeUrl(value: string) {
  const firstSegment = value.split('/')[0]

  return firstSegment.includes('.') && !firstSegment.includes(' ')
}

function getBackendOrigin() {
  if (!BASE_API_URL) return window.location.origin

  try {
    return new URL(BASE_API_URL).origin
  } catch {
    return window.location.origin
  }
}

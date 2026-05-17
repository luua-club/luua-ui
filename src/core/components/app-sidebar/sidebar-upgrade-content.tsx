import { Link } from '@tanstack/react-router'
import { BadgeCheck, Check } from 'lucide-react'

import { useUserState } from '@/core/hooks/user-state.hook'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'

const PRO_FEATURES = [
  'Unlimited schedules',
  'Unlimited autopilot',
  'Advanced style',
]

function SidebarUpgradeContent() {
  const user = useUserState()
  const plan = user?.plan ?? 'Free'

  if (plan !== 'Free') {
    return (
      <div className="flex h-full flex-col justify-between px-2 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium">Plan</p>
          <Badge variant="secondary" className="text-[10px]">
            {plan}
          </Badge>
        </div>
        <div className="flex flex-1 items-center py-4">
          <div className="text-muted-foreground flex items-start gap-2 text-[11px] leading-snug">
            <BadgeCheck className="mt-0.5 size-3.5 shrink-0 text-green-600 dark:text-green-400" />
            Pro features are enabled for this organisation.
          </div>
        </div>
        <Button asChild variant="outline" className="h-7 w-full text-xs">
          <Link to="/payments">Manage billing</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col justify-between px-2 py-2.5">
      <div className="space-y-1.5">
        <p className="text-sm leading-none font-semibold">Upgrade to Pro</p>
        <p className="text-muted-foreground text-xs leading-snug">
          Go beyond the Free plan limits.
        </p>
      </div>

      <div className="space-y-2.5 py-2">
        {PRO_FEATURES.map(feature => (
          <div
            key={feature}
            className="text-muted-foreground flex items-center gap-2.5 text-xs"
          >
            <Check className="size-3.5 shrink-0 text-green-600 dark:text-green-400" />
            <span className="truncate">{feature}</span>
          </div>
        ))}
      </div>

      <Button asChild className="h-8 w-full text-xs">
        <Link to="/payments">View plans</Link>
      </Button>
    </div>
  )
}

export default SidebarUpgradeContent

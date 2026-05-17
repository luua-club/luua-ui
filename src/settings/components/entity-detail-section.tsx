import { type ReactNode } from 'react'

import { Badge } from '@/shared/ui/badge'
import { Card } from '@/shared/ui/card'

interface EntityDetailSectionProps {
  label: string
  name: string
  role?: string
  plan?: string
  seatUsed?: number
  seatLimit?: number
  children?: ReactNode
}

function planBadgeVariant(plan: string): 'default' | 'secondary' | 'outline' {
  if (plan === 'Team') return 'default'
  if (plan === 'Pro') return 'default'
  return 'secondary'
}

function EntityDetailSection({
  label,
  name,
  role,
  plan,
  seatUsed,
  seatLimit,
  children,
}: EntityDetailSectionProps) {
  const seatPercent =
    seatLimit && seatLimit > 0
      ? Math.min(100, Math.round(((seatUsed ?? 0) / seatLimit) * 100))
      : 0

  return (
    <Card className="gap-0 overflow-hidden rounded-xl border p-0 shadow-none">
      {/* Active indicator + header */}
      <div className="bg-muted/40 border-b px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Active {label}
            </p>
            <p className="text-lg font-semibold">{name}</p>
            {role && (
              <p className="text-muted-foreground text-sm capitalize">
                Your role: {role.replace('_', ' ')}
              </p>
            )}
          </div>

          {plan && (
            <Badge variant={planBadgeVariant(plan)} className="mt-1 text-xs">
              {plan} Plan
            </Badge>
          )}
        </div>
      </div>

      {/* Stats */}
      {seatLimit !== undefined && (
        <div className="border-b px-5 py-4">
          <div className="max-w-xs space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Seats used</span>
              <span className="font-medium">
                {seatUsed ?? 0} of {seatLimit}
              </span>
            </div>
            <div className="bg-muted h-1.5 overflow-hidden rounded-full">
              <div
                className="bg-primary h-full rounded-full transition-all"
                style={{ width: `${seatPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Settings slot */}
      {children && <div className="px-5 py-4">{children}</div>}
    </Card>
  )
}

export default EntityDetailSection

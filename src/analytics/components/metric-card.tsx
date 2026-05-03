import { type ReactNode } from 'react'

import { Card } from '@/shared/ui/card'

import ChangePill from './change-pill'

type MetricCardProps = {
  title: string
  value: string
  description: string
  trend?: number | null
  children?: ReactNode
}

export default function MetricCard({
  title,
  value,
  description,
  trend,
  children,
}: MetricCardProps) {
  return (
    <Card className="min-h-[230px] min-w-0 overflow-hidden rounded-lg border p-0 shadow-none">
      <div className="flex items-start justify-between gap-4 px-6 pt-6">
        <div className="min-w-0">
          <p className="text-foreground truncate text-lg font-semibold">
            {title}
          </p>
          <p className="text-foreground mt-6 truncate text-4xl font-semibold">
            {value}
          </p>
          <p className="text-muted-foreground mt-5 truncate font-medium">
            {description}
          </p>
        </div>
        {trend !== undefined && <ChangePill value={trend} />}
      </div>

      <div className="overflow-hidden">{children}</div>
    </Card>
  )
}

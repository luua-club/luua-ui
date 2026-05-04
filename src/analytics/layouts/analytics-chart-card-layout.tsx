import { CircleHelp } from 'lucide-react'
import { type ReactNode } from 'react'

import ChangePill from '@/shared/components/change-pill'
import { Card } from '@/shared/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

interface AnalyticsChartCardProps {
  title: string
  value: string
  helper: string
  tooltip: string
  trend?: number | null
  legend?: ReactNode
  chart: ReactNode
  footer?: ReactNode
  chartClassName?: string
}

export default function AnalyticsChartCard({
  title,
  value,
  helper,
  tooltip,
  trend,
  legend,
  chart,
  footer,
  chartClassName = 'h-[120px] px-1 pt-1',
}: AnalyticsChartCardProps) {
  return (
    <Card className="w-full max-w-[400px] min-w-0 gap-0 overflow-hidden rounded-xl border p-0 shadow-none">
      <div className="flex items-start justify-between gap-4 px-5 pt-4">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-1.5">
            <p className="text-foreground truncate text-sm font-semibold">
              {title}
            </p>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={`About ${title}`}
                  className="text-muted-foreground hover:text-foreground flex size-4 shrink-0 items-center justify-center rounded-full transition-colors"
                >
                  <CircleHelp className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-64">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-foreground mt-1 truncate text-2xl font-semibold tracking-tight">
            {value}
          </p>
          <p className="text-muted-foreground mt-0.5 truncate text-xs font-medium">
            {helper}
          </p>
        </div>
        {trend !== undefined && <ChangePill value={trend} />}
      </div>

      {legend}

      <div className={`shrink-0 ${chartClassName}`}>{chart}</div>

      {footer}
    </Card>
  )
}

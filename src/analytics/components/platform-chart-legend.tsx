import { getSocialPlatformLabel } from '@/core/utils/social.utils'

type PlatformChartLegendProps = {
  colors: {
    LinkedIn: string
    Twitter: string
  }
  className?: string
  showValues?: {
    LinkedIn: string
    Twitter: string
  }
}

export default function PlatformChartLegend({
  colors,
  className = 'mt-1 flex h-4 items-center justify-end gap-4 px-5 text-[11px] font-medium',
  showValues,
}: PlatformChartLegendProps) {
  return (
    <div className={className}>
      <div className="text-muted-foreground flex items-center gap-1.5">
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: colors.LinkedIn }}
        />
        LinkedIn{showValues ? ` · ${showValues.LinkedIn}` : null}
      </div>
      <div className="text-muted-foreground flex items-center gap-1.5">
        <span
          className="border-border size-2 rounded-full border"
          style={{ backgroundColor: colors.Twitter }}
        />
        {getSocialPlatformLabel('Twitter')}
        {showValues ? ` · ${showValues.Twitter}` : null}
      </div>
    </div>
  )
}

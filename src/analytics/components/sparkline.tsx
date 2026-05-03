import { addDays, format } from 'date-fns'

import { DownloadSparkline } from '@/shared/components/download-sparkline'
import { cn } from '@/shared/utils'

type SparklineProps = {
  data: number[]
  className?: string
  color?: string
  showArea?: boolean
  width?: number
  height?: number
  strokeWidth?: number
  showEndpoint?: boolean
}

export default function Sparkline({
  data,
  className,
  color = 'rgb(16 185 129)',
  showArea = true,
  width = 520,
  height = 120,
  strokeWidth = 2.5,
  showEndpoint = true,
}: SparklineProps) {
  const points = data.map((downloads, index) => ({
    day: format(addDays(new Date(2026, 0, 1), index), 'yyyy-MM-dd'),
    downloads,
  }))

  return (
    <DownloadSparkline
      package="luua-analytics"
      data={points}
      variant={showArea ? 'area' : 'line'}
      color={color}
      width={width}
      height={height}
      strokeWidth={strokeWidth}
      showEndpoint={showEndpoint}
      className={cn('w-full [&_svg]:w-full', className)}
    />
  )
}

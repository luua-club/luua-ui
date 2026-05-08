import { Pie, PieChart, Tooltip } from 'recharts'

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/shared/ui/chart'

interface DonutChartProps<TData extends Record<string, string | number>> {
  data: TData[]
  config: ChartConfig
  dataKey: string
  nameKey: string
  innerRadius?: number
  outerRadius?: number
  tooltipClassName?: string
}

export default function DonutChart<
  TData extends Record<string, string | number>,
>({
  data,
  config,
  dataKey,
  nameKey,
  innerRadius = 38,
  outerRadius = 58,
  tooltipClassName,
}: DonutChartProps<TData>) {
  return (
    <ChartContainer config={config} className="h-full w-full">
      <PieChart accessibilityLayer>
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent className={tooltipClassName} />}
        />
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={4}
          stroke="var(--color-card)"
          strokeWidth={4}
          isAnimationActive={false}
        />
      </PieChart>
    </ChartContainer>
  )
}

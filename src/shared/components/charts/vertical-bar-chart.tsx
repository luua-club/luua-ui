import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts'

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/shared/ui/chart'

interface VerticalBarChartProps<TData extends Record<string, string | number>> {
  data: TData[]
  config: ChartConfig
  categoryKey: string
  valueKey: string
  categoryWidth?: number
  tooltipClassName?: string
}

export default function VerticalBarChart<
  TData extends Record<string, string | number>,
>({
  data,
  config,
  categoryKey,
  valueKey,
  categoryWidth = 64,
  tooltipClassName,
}: VerticalBarChartProps<TData>) {
  return (
    <ChartContainer config={config} className="h-full w-full">
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{ top: 6, right: 18, left: 8, bottom: 6 }}
      >
        <YAxis
          dataKey={categoryKey}
          type="category"
          tickLine={false}
          tickMargin={8}
          axisLine={false}
          width={categoryWidth}
          fontSize={11}
        />
        <XAxis dataKey={valueKey} type="number" hide />
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent className={tooltipClassName} />}
        />
        <Bar dataKey={valueKey} radius={6} isAnimationActive={false} />
      </BarChart>
    </ChartContainer>
  )
}

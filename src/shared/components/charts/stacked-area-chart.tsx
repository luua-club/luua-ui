import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/shared/ui/chart'

export type StackedAreaChartSeries = {
  key: string
  color: string
  gradientId: string
}

interface StackedAreaChartProps<TData extends Record<string, string | number>> {
  data: TData[]
  config: ChartConfig
  xAxisKey: string
  series: StackedAreaChartSeries[]
  stackId?: string
  tooltipClassName?: string
  yDomain?: [number | string, number | string]
}

export default function StackedAreaChart<
  TData extends Record<string, string | number>,
>({
  data,
  config,
  xAxisKey,
  series,
  stackId = 'stack',
  tooltipClassName,
  yDomain = [0, 'dataMax + 200'],
}: StackedAreaChartProps<TData>) {
  return (
    <ChartContainer config={config} className="h-full w-full">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 6, right: 0, left: 0, bottom: 0 }}
      >
        <defs>
          {series.map(item => (
            <linearGradient
              key={item.gradientId}
              id={item.gradientId}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={item.color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={item.color} stopOpacity={0.03} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey={xAxisKey}
          hide
          tickLine={false}
          axisLine={false}
          height={0}
        />
        <YAxis hide domain={yDomain} />
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent className={tooltipClassName} />}
        />
        {series.map(item => (
          <Area
            key={item.key}
            dataKey={item.key}
            type="monotone"
            stackId={stackId}
            stroke={item.color}
            strokeWidth={2}
            fill={`url(#${item.gradientId})`}
            fillOpacity={1}
            isAnimationActive={false}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  )
}

import { getSocialPlatformLabel } from '@/core/utils/social.utils'
import { Card } from '@/shared/ui/card'

import { type CommonAnalyticsSummary, formatNumber } from '../utils'
import ChannelBars from './channel-bars'

export default function ChannelBreakdownCard({
  summary,
}: {
  summary: CommonAnalyticsSummary
}) {
  return (
    <Card className="min-h-[360px] min-w-0 rounded-lg border p-6 shadow-none">
      <div>
        <p className="text-foreground text-lg font-semibold">
          Engagement by Channel
        </p>
        <p className="text-foreground mt-6 text-4xl font-semibold tracking-tight">
          {formatNumber(summary.totalEngagement)}
        </p>
        <p className="text-muted-foreground mt-4 font-medium">
          LinkedIn vs {getSocialPlatformLabel('Twitter')} contribution
        </p>
      </div>

      <div className="mt-10">
        <ChannelBars totals={summary.channelEngagement} />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3">
        <div className="rounded-md border p-3">
          <p className="text-muted-foreground text-xs font-medium">LinkedIn</p>
          <p className="mt-1 text-lg font-semibold">
            {formatNumber(summary.channelPostCount.LinkedIn)} posts
          </p>
        </div>
        <div className="rounded-md border p-3">
          <p className="text-muted-foreground text-xs font-medium">
            {getSocialPlatformLabel('Twitter')}
          </p>
          <p className="mt-1 text-lg font-semibold">
            {formatNumber(summary.channelPostCount.Twitter)} posts
          </p>
        </div>
      </div>
    </Card>
  )
}

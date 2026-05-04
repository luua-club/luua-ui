import { SOCIAL_PLATFORM } from '@/core/config/constant'
import { type AnalyticsChannel } from '@/core/models/analytics.model'
import { getSocialPlatformLabel } from '@/core/utils/social.utils'
import { Badge } from '@/shared/ui/badge'

export default function ChannelBadge({
  channel,
}: {
  channel: AnalyticsChannel
}) {
  const platform = SOCIAL_PLATFORM.find(item => item.name === channel)
  const Logo = platform?.logo

  return (
    <Badge variant="outline" className="gap-1.5 rounded-sm">
      {Logo && <Logo className="size-3" />}
      {getSocialPlatformLabel(channel)}
    </Badge>
  )
}

import { ChevronRight } from 'lucide-react'

import Socials from '@/core/containers/socials'
import { channelType } from '@/core/models/social.model'
import { UserState } from '@/core/models/user.model'

interface ConnectPublishProps {
  user: UserState
  channel?: channelType
}

function ConnectPublish({ user, channel }: ConnectPublishProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="flex items-center gap-1 text-lg font-semibold">
          Connect your socials <ChevronRight className="size-5" />
        </h2>
        <p className="text-muted-foreground text-sm font-medium text-balance">
          Connect your LinkedIn or X/Twitter safely — we use official
          integrations and never access your personal data. Every post goes live
          only after you approve it.
        </p>
      </div>
      <Socials user={user} channel={channel} />
    </div>
  )
}

export default ConnectPublish

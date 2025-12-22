import { ChevronRight } from 'lucide-react'

import { SOCIAL_PLATFORM } from '@/core/config/constant'
import Socials from '@/core/containers/socials'
import { PostItem } from '@/core/models/draft.model'
import { channelType } from '@/core/models/social.model'
import { UserState } from '@/core/models/user.model'
import QuickShareCallout from '@/shared/components/quickshare-callout'
import { Button } from '@/shared/ui/button'

interface ConnectPublishProps {
  user: UserState
  channels?: channelType[]
  hideQuickShare?: boolean
  selectedPosts: PostItem[]
}

function ConnectPublish({
  user,
  channels,
  hideQuickShare = true,
  selectedPosts,
}: ConnectPublishProps) {
  const postContent = selectedPosts.map(p => p.content).join('\n\n')

  const openInNewTab = (url: string) =>
    window.open(url, '_blank', 'noopener,noreferrer')

  const handleShare = (platform: string) => {
    let intent = ''

    if (platform === 'Twitter') {
      intent = `https://x.com/intent/post?text=${encodeURIComponent(
        postContent
      )}&url=${encodeURIComponent(window.location.href)}`
    } else if (platform === 'LinkedIn') {
      intent = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        window.location.href
      )}&text=${encodeURIComponent(postContent)}`
    }

    if (intent) openInNewTab(intent)
  }

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

      <Socials user={user} channels={channels} />

      {/* Quick share */}
      {!hideQuickShare && (
        <div className="max-w-xl">
          <QuickShareCallout>
            <div className="flex items-center gap-3">
              {SOCIAL_PLATFORM.map(platform => {
                const Icon = platform.logo
                return (
                  <Button
                    key={platform.name}
                    size={'sm'}
                    onClick={() => handleShare(platform.name)}
                    variant="outline"
                    className="text-card-foreground cursor-pointer text-xs"
                  >
                    <Icon className="size-4" />
                    Share to {platform.name}
                  </Button>
                )
              })}
            </div>
          </QuickShareCallout>
        </div>
      )}
    </div>
  )
}

export default ConnectPublish

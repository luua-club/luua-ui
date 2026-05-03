import { Link } from '@tanstack/react-router'
import { Settings } from 'lucide-react'

import { SOCIAL_PLATFORM } from '@/core/config/constant'
import { useUserState } from '@/core/hooks/user-state.hook'
import { type ConnectedChannels } from '@/core/models/org.model'
import {
  type channelType,
  type ProjectSocial,
} from '@/core/models/social.model'
import { extractUserInitial } from '@/core/utils/common.util'
import { getSocialPlatformLabel } from '@/core/utils/social.utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils'

type AnalyticsSocialChannel = {
  name: Extract<channelType, 'LinkedIn' | 'Twitter'>
  key: 'linkedin' | 'twitter'
}

type ConnectedAnalyticsAccount = {
  name: Extract<channelType, 'LinkedIn' | 'Twitter'>
  label: string
  accountName: string
  accountImage?: string | null
  accountType: string
  Logo: NonNullable<(typeof SOCIAL_PLATFORM)[number]['logo']>
}

const ANALYTICS_CHANNELS: AnalyticsSocialChannel[] = [
  { name: 'LinkedIn', key: 'linkedin' },
  { name: 'Twitter', key: 'twitter' },
]

function getLinkedInAccount(channel: ProjectSocial) {
  const isPageAccount = channel.meta?.account_type === 'page'
  const selectedPage = channel.meta?.pages?.find(
    page => page.id === channel.meta?.organization_id
  )

  return {
    accountName: isPageAccount
      ? channel.meta?.organization_name ||
        channel.meta?.organizaion_name ||
        selectedPage?.name ||
        channel.user_name
      : channel.user_name,
    accountImage: isPageAccount
      ? channel.meta?.organization_profile_image ||
        selectedPage?.profile_image ||
        channel.user_profile_picture
      : channel.user_profile_picture,
    accountType: isPageAccount ? 'Page' : 'Profile',
  }
}

function getConnectedAnalyticsAccounts(
  connectedChannels: ConnectedChannels | null
) {
  if (!connectedChannels) return []

  return ANALYTICS_CHANNELS.flatMap(channelConfig => {
    const channel = connectedChannels[channelConfig.key]
    const platform = SOCIAL_PLATFORM.find(
      socialPlatform => socialPlatform.name === channelConfig.name
    )

    if (!channel?.connected || !platform) return []
    if (channelConfig.name === 'LinkedIn' && !channel.meta?.account_type) {
      return []
    }

    const account =
      channelConfig.name === 'LinkedIn'
        ? getLinkedInAccount(channel)
        : {
            accountName: channel.user_name,
            accountImage: channel.user_profile_picture,
            accountType: 'Profile',
          }

    return {
      name: channelConfig.name,
      label: getSocialPlatformLabel(channelConfig.name),
      Logo: platform.logo,
      ...account,
    }
  })
}

function ConnectedAccountAvatar({
  account,
  index,
}: {
  account: ConnectedAnalyticsAccount
  index: number
}) {
  const Logo = account.Logo

  return (
    <div
      className={cn(
        'bg-card border-secondary dark:border-secondary/70 relative rounded-full border-2',
        index > 0 && '-ml-2.5'
      )}
      title={`${account.label}: ${account.accountName}`}
    >
      <Avatar className="size-7">
        <AvatarImage src={account.accountImage ?? undefined} />
        <AvatarFallback className="text-[10px] font-semibold">
          {extractUserInitial(account.accountName)}
        </AvatarFallback>
      </Avatar>
      <span className="bg-card absolute -right-0.5 -bottom-0.5 flex size-3.5 items-center justify-center rounded-full border">
        <Logo className="size-2" />
      </span>
    </div>
  )
}

function ConnectedSocialsCard() {
  const user = useUserState()
  const connectedAccounts = getConnectedAnalyticsAccounts(
    user?.connectedChannels ?? null
  )
  const connectedCount = connectedAccounts.length
  const title =
    connectedAccounts.length > 0
      ? connectedAccounts
          .map(account => `${account.label}: ${account.accountName}`)
          .join('\n')
      : `Connect LinkedIn or ${getSocialPlatformLabel('Twitter')} to power analytics`

  return (
    <div
      className="bg-card flex w-fit items-center gap-2 rounded-md border px-2.5 py-1.5 shadow-xs"
      title={title}
    >
      <div className="flex items-center">
        {connectedAccounts.length > 0 ? (
          connectedAccounts.map((account, index) => (
            <ConnectedAccountAvatar
              key={account.name}
              account={account}
              index={index}
            />
          ))
        ) : (
          <div className="flex items-center">
            {ANALYTICS_CHANNELS.map((channel, index) => {
              const platform = SOCIAL_PLATFORM.find(
                socialPlatform => socialPlatform.name === channel.name
              )
              if (!platform) return null

              const Logo = platform.logo

              return (
                <span
                  key={channel.name}
                  className={cn(
                    'bg-muted border-secondary dark:border-secondary/70 flex size-7 items-center justify-center rounded-full border-2',
                    index > 0 && '-ml-2.5'
                  )}
                >
                  <Logo className="size-3.5 opacity-60" />
                </span>
              )
            })}
          </div>
        )}
      </div>

      <div className="hidden min-w-0 sm:block">
        <p className="text-foreground text-xs leading-none font-semibold">
          Socials
        </p>
        <p className="text-muted-foreground mt-0.5 text-[11px] leading-none">
          {connectedCount || 0} connected
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-foreground size-7 rounded-full"
        asChild
      >
        <Link
          to="/settings"
          search={{ tab: 'socials' }}
          aria-label="Manage socials"
        >
          <Settings className="size-3.5" />
        </Link>
      </Button>
    </div>
  )
}

export default ConnectedSocialsCard

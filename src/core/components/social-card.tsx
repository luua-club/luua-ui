import { Loader, Trash } from 'lucide-react'

import { ISocialChannel, ProjectSocial } from '@/core/models/social.model'
import { extractUserInitial } from '@/core/utils/common.util'

import { Avatar, AvatarFallback, AvatarImage } from '../../shared/ui/avatar'
import { Button } from '../../shared/ui/button'
import PulseCheck from '../../shared/ui/pulse-check'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../shared/ui/tooltip'
import { cn } from '../../shared/utils'

interface SocialCardProps {
  platform: ISocialChannel
  channel?: ProjectSocial
  isLoading?: boolean
  onConnect?: () => void
  onDisconnect?: () => void
}

function SocialCard({
  platform,
  channel,
  isLoading,
  onConnect,
  onDisconnect,
}: SocialCardProps) {
  const isLinkedInPending =
    platform.name === 'LinkedIn' &&
    channel?.connected &&
    !channel?.meta?.account_type
  const isConnected = channel?.connected && !isLinkedInPending
  const isPageAccount =
    platform.name === 'LinkedIn' && channel?.meta?.account_type === 'page'
  const selectedLinkedInPage = channel?.meta?.pages?.find(
    page => page.id === channel?.meta?.organization_id
  )
  const accountName = isPageAccount
    ? channel?.meta?.organization_name ||
      channel?.meta?.organizaion_name ||
      selectedLinkedInPage?.name ||
      channel?.user_name
    : channel?.user_name
  const accountImage = isPageAccount
    ? channel?.meta?.organization_profile_image ||
      selectedLinkedInPage?.profile_image ||
      channel?.user_profile_picture
    : channel?.user_profile_picture

  return (
    <div
      className={cn(
        'max-w-[450px] rounded-2xl border-1 p-2 pt-0 pb-2',
        isConnected &&
          'border-brand-border-success bg-brand-background-success dark:bg-card dark:border-card',
        !isConnected &&
          'border-brand-border-warning bg-brand-background-warning dark:bg-card dark:border-card'
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center gap-2 py-3 text-sm font-semibold',
          isConnected && 'text-brand-text-success dark:text-green-500',
          !isConnected && 'text-brand-text-warning dark:text-orange-400'
        )}
      >
        {platform?.logo && <platform.logo className="size-5" />}
        <span>
          {isConnected
            ? `${platform.label} connected`
            : isLinkedInPending
              ? `${platform.label} pending setup`
              : `${platform.label} not connected`}
        </span>
      </div>

      <div
        className={cn(
          'bg-card dark:bg-background flex flex-col items-center justify-center space-y-4 rounded-xl p-2 text-center shadow-md',
          !isConnected && 'p-6'
        )}
      >
        {isConnected ? (
          <PulseCheck />
        ) : (
          <div className="dark:border-card-foreground/30 flex items-center justify-center rounded-full border-2 border-dashed p-2">
            <platform.logo className="size-6" />
          </div>
        )}

        <div className="space-y-2 px-2">
          <h3 className="text-lg leading-tight font-semibold">
            {isConnected
              ? `Your ${platform.label} is connected`
              : isLinkedInPending
                ? `Finish your ${platform.label} setup`
                : `Connect your ${platform.label} account`}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed text-balance">
            {isConnected
              ? `You can safely post content to this platform. Every post goes live only after you approve it.`
              : isLinkedInPending
                ? 'Choose whether to post as your profile or as a page to complete setup.'
                : 'We use official integrations and never access your personal data'}
          </p>
        </div>

        {isConnected ? (
          <div className="dark:bg-card dark:border-card flex w-full items-center justify-between rounded-xl border border-gray-100 p-3 pr-3 pl-3 text-left">
            <div className="flex items-center gap-3">
              <Avatar className="dark:border-card h-10 w-10 border border-gray-100">
                <AvatarImage src={accountImage ?? undefined} />
                <AvatarFallback className="dark:bg-card-foreground dark:text-card bg-gray-100 text-gray-600">
                  {extractUserInitial(accountName ?? '')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="dark:text-card-foreground/70 text-xs text-gray-500">
                  {isPageAccount ? 'Page Account' : 'Personal Account'}
                </p>
                <p className="dark:text-card-foreground text-sm font-semibold text-gray-900">
                  {accountName}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={onDisconnect}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader className="size-4 animate-spin" />
                    ) : (
                      <Trash className="size-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Disconnect account</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        ) : (
          <Button
            variant="default"
            className="w-full"
            disabled={isLoading}
            onClick={onConnect}
          >
            {isLoading && <Loader className="size-4 animate-spin" />}
            {isLinkedInPending ? 'Complete setup' : 'Connect'}
          </Button>
        )}
      </div>
    </div>
  )
}

export default SocialCard

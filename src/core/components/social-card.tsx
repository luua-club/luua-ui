import { useRouter } from '@tanstack/react-router'
import { Loader, Trash } from 'lucide-react'

import { ISocialChannel, UserSocial } from '@/core/models/social.model'
import { extractUserInitial } from '@/core/utils/common.util'

import UpgradePlanCta from '../../shared/components/upgrade-plan-cta'
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
  userChannel: UserSocial
  isLoading?: boolean
  showUpgradePlan?: boolean
  onConnect?: () => void
  onDisconnect?: () => void
}

function SocialCard({
  platform,
  userChannel,
  isLoading,
  showUpgradePlan,
  onConnect,
  onDisconnect,
}: SocialCardProps) {
  const router = useRouter()
  return (
    <div
      className={cn(
        'w-full rounded-2xl border-1 p-2 pt-0 pb-2',
        userChannel.connected &&
          'border-brand-border-success bg-brand-background-success dark:bg-card dark:border-card',
        !userChannel.connected &&
          'border-brand-border-warning bg-brand-background-warning dark:bg-card dark:border-card'
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center gap-2 py-3 text-sm font-semibold',
          userChannel.connected &&
            'text-brand-text-success dark:text-green-500',
          !userChannel.connected &&
            'text-brand-text-warning dark:text-orange-400'
        )}
      >
        {platform?.logo && <platform.logo className="size-5" />}
        <span>
          {userChannel.connected
            ? `${platform.name} connected`
            : `${platform.name} not connected`}
        </span>
      </div>

      <div
        className={cn(
          'bg-card dark:bg-background flex flex-col items-center justify-center space-y-4 rounded-xl p-2 text-center shadow-md',
          !userChannel.connected && 'p-6'
        )}
      >
        {userChannel.connected ? (
          <PulseCheck />
        ) : (
          <div className="dark:border-card-foreground/30 flex items-center justify-center rounded-full border-2 border-dashed p-2">
            <platform.logo className="size-6" />
          </div>
        )}

        <div className="space-y-2 px-2">
          <h3 className="text-lg leading-tight font-semibold">
            {userChannel.connected
              ? `Your ${platform.name} is connected`
              : `Connect your ${platform.name} account`}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed text-balance">
            {userChannel.connected
              ? `You can safely post content to this platform. Every post goes live only after you approve it.`
              : 'We use official integrations and never access your personal data'}
          </p>
        </div>

        {userChannel.connected ? (
          <div className="dark:bg-card dark:border-card flex w-full items-center justify-between rounded-xl border border-gray-100 p-3 pr-3 pl-3 text-left">
            <div className="flex items-center gap-3">
              <Avatar className="dark:border-card h-10 w-10 border border-gray-100">
                <AvatarImage
                  src={userChannel.user_profile_picture ?? undefined}
                />
                <AvatarFallback className="dark:bg-card-foreground dark:text-card bg-gray-100 text-gray-600">
                  {extractUserInitial(userChannel.user_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="dark:text-card-foreground/70 text-xs text-gray-500">
                  Account Info
                </p>
                <p className="dark:text-card-foreground text-sm font-semibold text-gray-900">
                  {userChannel.user_name}
                </p>
                {userChannel.user_id && platform.name !== 'LinkedIn' && (
                  <p className="text-xs text-gray-400">{userChannel.user_id}</p>
                )}
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
        ) : showUpgradePlan ? (
          <UpgradePlanCta
            onClick={() =>
              router.navigate({
                to: '/payments',
              })
            }
          />
        ) : (
          <Button
            variant="default"
            className="w-full"
            disabled={isLoading}
            onClick={onConnect}
          >
            {isLoading && <Loader className="size-4 animate-spin" />}
            Connect
          </Button>
        )}
      </div>
    </div>
  )
}

export default SocialCard

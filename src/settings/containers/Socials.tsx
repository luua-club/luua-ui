import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PlugZap } from 'lucide-react'
import { toast } from 'sonner'

import { oauthApi } from '@/core/api/oauth.api'
import { userApi } from '@/core/api/user.api'
import { QUERY_KEYS, SOCIAL_PLATFORM } from '@/core/config/constant'
import {
  channelType,
  ISocialChannel,
  IUserConnectedChannel,
} from '@/core/models/social.model'
import { IUserState } from '@/core/models/user.model'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { BorderBeam } from '@/shared/ui/border-beam'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardFooter } from '@/shared/ui/card'
import { Separator } from '@/shared/ui/separator'
import { cn } from '@/shared/utils'

const Socials = ({ user }: { user: IUserState }) => {
  const queryClient = useQueryClient()
  const twitter = SOCIAL_PLATFORM.find(s => s.name === 'Twitter')!
  const linkedin = SOCIAL_PLATFORM.find(s => s.name === 'LinkedIn')!

  const isLinkedinConnected = user.connected_channels.linkedin.connected
  const isTwitterConnected = user.connected_channels.twitter.connected

  const handleConnect = async (platform: channelType) => {
    try {
      // Use OAuth API service to get LinkedIn authorization URL
      // The API service will handle adding authentication headers
      const response =
        platform === 'Twitter'
          ? await oauthApi.twitterAuthorize()
          : await oauthApi.linkedinAuthorize()

      // Backend returns the authorization URL, redirect to it
      if (response.data) {
        window.location.href = response.data.authorization_url
      }
    } catch {
      toast.error(`Failed to connect to ${platform}, Please try again`)
    }
  }

  const handleDisconnectMutation = useMutation({
    mutationFn: async (payload: channelType) => {
      await userApi.disconnectSocial(payload)
      return payload
    },
    onSuccess: (payload: channelType) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] })
      toast.success(`Disconnected from ${payload}`)
    },
    onError: (_error: Error, payload: channelType) => {
      toast.error(`Failed to disconnect from ${payload}, Please try again`)
    },
  })

  return (
    <>
      {/* Heading */}
      <div className="py-4">
        <h1 className="text-lg font-medium">Social Platforms</h1>
      </div>
      <Separator />
      <p className="text-muted-foreground mt-4 text-base text-balance lg:max-w-2xl">
        Social account connection is required to post content to your social
        accounts, AI content can only be generated only when at least one social
        account is connected.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 lg:max-w-2xl lg:grid-cols-2">
        <SocialCard
          platform={twitter}
          isAccountConnected={isTwitterConnected}
          userChannel={user.connected_channels.twitter}
          onConnect={() => handleConnect('Twitter')}
          onDisconnect={() => handleDisconnectMutation.mutate('Twitter')}
        />
        <SocialCard
          platform={linkedin}
          isAccountConnected={isLinkedinConnected}
          userChannel={user.connected_channels.linkedin}
          onConnect={() => handleConnect('LinkedIn')}
          onDisconnect={() => handleDisconnectMutation.mutate('LinkedIn')}
        />
      </div>
    </>
  )
}

const SocialCard = ({
  platform,
  isAccountConnected,
  userChannel,
  onConnect,
  onDisconnect,
}: {
  platform: ISocialChannel
  userChannel: IUserConnectedChannel
  isAccountConnected?: boolean
  onConnect?: () => void
  onDisconnect?: () => void
}) => {
  return (
    <Card className="relative flex flex-col overflow-hidden rounded-md p-4 shadow-none">
      <BorderBeam
        duration={20}
        size={150}
        colorTo={isAccountConnected ? '#34D399' : '#DC2626'}
        colorFrom={isAccountConnected ? '#34D399' : '#DC2626'}
        borderWidth={2}
      />

      <CardContent className="flex h-24 flex-col p-0">
        <div className="flex items-center justify-between">
          {isAccountConnected ? (
            <div className="flex items-center">
              <Avatar className="bg-accent h-12 w-12 rounded-full">
                <AvatarImage
                  src={userChannel.user_profile_picture}
                  alt={userChannel.user_name}
                />
                <AvatarFallback>{'DL'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col pl-2">
                <h6 className="text-base font-medium">
                  {userChannel.user_name}
                </h6>
                {userChannel.user_id && (
                  <p className="text-xs font-medium text-gray-400">
                    {userChannel.user_id}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-xl font-medium">
                {platform.name === 'Twitter' ? 'Twitter' : platform.name}
              </p>
              <span
                className={cn('size-1.5 animate-pulse rounded-full bg-red-500')}
              ></span>
            </div>
          )}
          {platform && platform.logo && (
            <platform.logo className="size-10 rounded-full border-1 border-dashed p-2" />
          )}
        </div>
        <p
          className={cn(
            'mt-2 text-sm text-gray-400',
            isAccountConnected ? '' : 'text-black'
          )}
        >
          {isAccountConnected
            ? 'Your account is connected, now you can post content to this platform.'
            : 'Please connect your social account to get started, click on connect button'}
        </p>
      </CardContent>
      <CardFooter className="p-0">
        <Button
          className="w-full"
          variant={isAccountConnected ? 'destructive' : 'default'}
          onClick={!isAccountConnected ? onConnect : onDisconnect}
        >
          <PlugZap />
          {isAccountConnected ? 'Disconnect' : 'Connect'}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Socials

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

import { oauthApi } from '@/core/api/oauth.api'
import { userApi } from '@/core/api/user.api'
import SocialCard from '@/core/components/social-card'
import { QUERY_KEYS, SOCIAL_PLATFORM } from '@/core/config/constant'
import { channelType } from '@/core/models/social.model'
import { UserState } from '@/core/models/user.model'

const Socials = ({
  user,
  channels,
}: {
  user: UserState
  channels?: channelType[]
}) => {
  const queryClient = useQueryClient()
  const [loadingStates, setLoadingStates] = useState<
    Record<channelType, boolean>
  >({
    Twitter: false,
    LinkedIn: false,
  })

  const twitter = SOCIAL_PLATFORM.find(s => s.name === 'Twitter')!
  const linkedin = SOCIAL_PLATFORM.find(s => s.name === 'LinkedIn')!

  const handleConnect = async (platform: channelType) => {
    try {
      setSocialLoading(platform, true)
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
    } finally {
      setSocialLoading(platform, false)
    }
  }

  const handleDisconnectMutation = useMutation({
    mutationFn: async (payload: channelType) => {
      setSocialLoading(payload, true)
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
    onSettled: (
      _data: channelType | undefined,
      _error: Error | null,
      payload: channelType
    ) => {
      setSocialLoading(payload, false)
    },
  })

  const setSocialLoading = (payload: channelType, isLoading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [payload]: isLoading }))
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {(!channels || channels.includes('LinkedIn')) && (
        <SocialCard
          platform={linkedin}
          userChannel={user?.connected_channels?.linkedin}
          isLoading={loadingStates.LinkedIn}
          onConnect={() => handleConnect('LinkedIn')}
          onDisconnect={() => handleDisconnectMutation.mutate('LinkedIn')}
        />
      )}

      {(!channels || channels.includes('Twitter')) && (
        <SocialCard
          platform={twitter}
          userChannel={user?.connected_channels?.twitter}
          isLoading={loadingStates.Twitter}
          onConnect={() => handleConnect('Twitter')}
          onDisconnect={() => handleDisconnectMutation.mutate('Twitter')}
          showUpgradePlan={user?.plan === 'Free'}
        />
      )}
    </div>
  )
}

export default Socials

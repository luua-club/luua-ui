import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { oauthApi } from '@/core/api/oauth.api'
import { userApi } from '@/core/api/user.api'
import LinkedInTargetSelectorDialog from '@/core/components/linkedin-target-selector-dialog'
import SocialCard from '@/core/components/social-card'
import { QUERY_KEYS, SOCIAL_PLATFORM } from '@/core/config/constant'
import { useUserState } from '@/core/hooks/user-state.hook'
import { channelType, LinkedInAccountType } from '@/core/models/social.model'

const INSTAGRAM_OAUTH_ERROR_PARAM = 'instagram_oauth_error'
const INSTAGRAM_OAUTH_ERROR_MESSAGES: Record<string, string> = {
  personal_account_unsupported:
    "Personal Instagram accounts can't post via API. Switch your account to Business or Creator in the Instagram app and try again.",
}

const Socials = ({ channels }: { channels?: channelType[] }) => {
  const queryClient = useQueryClient()
  const userState = useUserState()
  const connectedChannels = userState?.connectedChannels
  const [loadingStates, setLoadingStates] = useState<
    Record<channelType, boolean>
  >({
    Twitter: false,
    LinkedIn: false,
    Instagram: false,
  })

  const twitter = SOCIAL_PLATFORM.find(s => s.name === 'Twitter')!
  const linkedin = SOCIAL_PLATFORM.find(s => s.name === 'LinkedIn')!
  const instagram = SOCIAL_PLATFORM.find(s => s.name === 'Instagram')!
  const linkedInChannel = connectedChannels?.linkedin
  const isLinkedInSetupPending = Boolean(
    linkedInChannel?.connected && !linkedInChannel?.meta?.account_type
  )
  const [isLinkedInSelectorOpen, setIsLinkedInSelectorOpen] = useState(false)

  const instagramChannel = connectedChannels?.instagram

  const handleConnect = async (platform: channelType) => {
    try {
      setSocialLoading(platform, true)
      let response: { data?: { authorization_url: string } } | undefined
      if (platform === 'Twitter') {
        response = await oauthApi.twitterAuthorize()
      } else if (platform === 'LinkedIn') {
        response = await oauthApi.linkedinAuthorize()
      } else if (platform === 'Instagram') {
        response = await oauthApi.instagramAuthorize()
      }

      if (response?.data) {
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
    onSuccess: async (payload: channelType) => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] })
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

  const linkedInTargetMutation = useMutation({
    mutationFn: (payload: {
      account_type: LinkedInAccountType
      organization_id: string | null
    }) => userApi.setLinkedInTarget(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] })
      toast.success('LinkedIn account setup completed')
      setIsLinkedInSelectorOpen(false)
    },
    onError: () => {
      toast.error('Failed to save LinkedIn account selection')
    },
  })

  useEffect(() => {
    if (isLinkedInSetupPending) {
      setIsLinkedInSelectorOpen(true)
      return
    }
    setIsLinkedInSelectorOpen(false)
  }, [isLinkedInSetupPending])

  // Surface OAuth callback errors that the backend appends to the redirect URL
  // (e.g. ?instagram_oauth_error=personal_account_unsupported). One-shot:
  // strip the param after showing the toast so refresh doesn't re-fire it.
  useEffect(() => {
    const url = new URL(window.location.href)
    const errorCode = url.searchParams.get(INSTAGRAM_OAUTH_ERROR_PARAM)
    if (!errorCode) return
    const message =
      INSTAGRAM_OAUTH_ERROR_MESSAGES[errorCode] ??
      'Failed to connect Instagram. Please try again.'
    toast.error(message)
    url.searchParams.delete(INSTAGRAM_OAUTH_ERROR_PARAM)
    window.history.replaceState({}, '', url.toString())
  }, [])

  const setSocialLoading = (payload: channelType, isLoading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [payload]: isLoading }))
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {(!channels || channels.includes('LinkedIn')) && (
          <SocialCard
            platform={linkedin}
            channel={linkedInChannel}
            isLoading={
              loadingStates.LinkedIn || linkedInTargetMutation.isPending
            }
            onConnect={() =>
              isLinkedInSetupPending
                ? setIsLinkedInSelectorOpen(true)
                : handleConnect('LinkedIn')
            }
            onDisconnect={() => handleDisconnectMutation.mutate('LinkedIn')}
          />
        )}

        {(!channels || channels.includes('Twitter')) && (
          <SocialCard
            platform={twitter}
            channel={connectedChannels?.twitter}
            isLoading={loadingStates.Twitter}
            onConnect={() => handleConnect('Twitter')}
            onDisconnect={() => handleDisconnectMutation.mutate('Twitter')}
          />
        )}

        {(!channels || channels.includes('Instagram')) && (
          <SocialCard
            platform={instagram}
            channel={instagramChannel}
            isLoading={loadingStates.Instagram}
            onConnect={() => handleConnect('Instagram')}
            onDisconnect={() => handleDisconnectMutation.mutate('Instagram')}
          />
        )}
      </div>

      {(!channels || channels.includes('LinkedIn')) && (
        <LinkedInTargetSelectorDialog
          open={isLinkedInSelectorOpen}
          onOpenChange={setIsLinkedInSelectorOpen}
          linkedInChannel={linkedInChannel}
          isSubmitting={linkedInTargetMutation.isPending}
          onSubmit={linkedInTargetMutation.mutate}
        />
      )}
    </>
  )
}

export default Socials

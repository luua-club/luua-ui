import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { oauthApi } from '@/core/api/oauth.api'
import { userApi } from '@/core/api/user.api'
import InstagramPageSelectorDialog from '@/core/components/instagram-page-selector-dialog'
import LinkedInTargetSelectorDialog from '@/core/components/linkedin-target-selector-dialog'
import SocialCard from '@/core/components/social-card'
import { QUERY_KEYS, SOCIAL_PLATFORM } from '@/core/config/constant'
import { useUserState } from '@/core/hooks/user-state.hook'
import {
  channelType,
  InstagramAccount,
  LinkedInAccountType,
} from '@/core/models/social.model'

// Instagram connect from settings is paused (flip flag when launching).
const INSTAGRAM_CONNECT_DISABLED_PENDING_BE = true
const INSTAGRAM_CONNECT_DISABLED_MESSAGE =
  'Instagram is not available yet—this is still a work in progress.'

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
  const instagramAccounts = (instagramChannel?.meta?.accounts ??
    []) as InstagramAccount[]
  const isInstagramSetupPending = Boolean(
    instagramChannel?.connected &&
      !instagramChannel?.meta?.selected_instagram_account_id
  )
  const [isInstagramSelectorOpen, setIsInstagramSelectorOpen] = useState(false)

  const handleConnect = async (platform: channelType) => {
    if (INSTAGRAM_CONNECT_DISABLED_PENDING_BE && platform === 'Instagram') {
      toast.info(INSTAGRAM_CONNECT_DISABLED_MESSAGE)
      return
    }
    try {
      setSocialLoading(platform, true)
      let response: { data?: { authorization_url: string } } | undefined
      if (platform === 'Twitter') {
        response = await oauthApi.twitterAuthorize()
      } else if (platform === 'LinkedIn') {
        response = await oauthApi.linkedinAuthorize()
      } else if (platform === 'Instagram') {
        // Re-enable when Instagram OAuth ships:
        // response = await oauthApi.instagramAuthorize()
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

  const instagramTargetMutation = useMutation({
    mutationFn: (instagram_account_id: string) =>
      userApi.setInstagramTarget({ instagram_account_id }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] })
      toast.success('Instagram account setup completed')
      setIsInstagramSelectorOpen(false)
    },
    onError: () => {
      toast.error('Failed to save Instagram account selection')
    },
  })

  useEffect(() => {
    if (isInstagramSetupPending) {
      setIsInstagramSelectorOpen(true)
      return
    }
    setIsInstagramSelectorOpen(false)
  }, [isInstagramSetupPending])

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
            isLoading={
              loadingStates.Instagram || instagramTargetMutation.isPending
            }
            connectDisabled={INSTAGRAM_CONNECT_DISABLED_PENDING_BE}
            connectDisabledReason={INSTAGRAM_CONNECT_DISABLED_MESSAGE}
            onConnect={() =>
              isInstagramSetupPending
                ? setIsInstagramSelectorOpen(true)
                : handleConnect('Instagram')
            }
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

      {(!channels || channels.includes('Instagram')) && (
        <InstagramPageSelectorDialog
          open={isInstagramSelectorOpen}
          onOpenChange={setIsInstagramSelectorOpen}
          accounts={instagramAccounts}
          selectedAccountId={
            instagramChannel?.meta?.selected_instagram_account_id as
              | string
              | null
          }
          isSubmitting={instagramTargetMutation.isPending}
          onSubmit={instagramTargetMutation.mutate}
        />
      )}
    </>
  )
}

export default Socials

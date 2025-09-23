import React from 'react'

import { InputPrompt } from '@/shared/components/input-prompt'
import { SOCIAL_STATUS } from '@/shared/config/constant'
import { cn } from '@/shared/utils'

import { SOCIAL_PLATFORM, SUGGESTED_PROMPT_TEXT } from '../config/constant'
import { useUserState } from '../hooks/user-state.hook'
import { channelType } from '../models/social.model'

interface PromptInputProps {
  loading?: boolean
  onChange: (content: string, search: boolean, channel: string | null) => void
  hidePromptInfo?: boolean
  activeChannel?: channelType | null
  className?: string
}

export const PromptInput = ({
  loading,
  onChange,
  hidePromptInfo,
  activeChannel,
  className,
}: PromptInputProps) => {
  const userState = useUserState()

  const getSocialStatus = (social: channelType) => {
    if (!userState || !userState.connected_channels) {
      return SOCIAL_STATUS.WARNING
    }

    if (
      social === 'LinkedIn' &&
      userState.connected_channels.linkedin?.connected
    ) {
      return SOCIAL_STATUS.OK
    } else if (
      social === 'Twitter' &&
      userState.connected_channels.twitter?.connected
    ) {
      return SOCIAL_STATUS.OK
    }

    return SOCIAL_STATUS.WARNING
  }

  const connectedSocials = SOCIAL_PLATFORM

  return (
    <InputPrompt
      loading={loading}
      placeholder={[...SUGGESTED_PROMPT_TEXT]}
      socials={[
        ...connectedSocials.map(social => ({
          icon: social.logo,
          tooltip: social.tooltip,
          text: social.name,
          status: getSocialStatus(social.name),
        })),
      ]}
      onChange={onChange}
      hidePromptInfo={hidePromptInfo}
      activeChannel={activeChannel}
      className={cn(className)}
    />
  )
}

interface FloatingPromptInputProps extends PromptInputProps {
  children?: React.ReactNode
}

export const FloatingPromptInput = ({
  children,
  ...props
}: FloatingPromptInputProps) => {
  return (
    <>
      <div className="h-48 w-full bg-transparent" />
      <div className="fixed bottom-0 flex w-[-webkit-fill-available] justify-center px-2 sm:px-5 lg:px-0">
        <div className="flex w-full max-w-2xl flex-col gap-2 pb-4">
          {children}
          <PromptInput {...props} />
        </div>
      </div>
    </>
  )
}

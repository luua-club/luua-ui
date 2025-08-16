import { InputPrompt } from '@/shared/components/input-prompt'
import { SOCIAL_STATUS } from '@/shared/constant'

import { SOCIAL_PLATFORM, SUGGESTED_PROMPT_TEXT } from '../config/constant'

interface PromptInputProps {
  btnText?: string
  btnIcon?: React.ReactNode
  backdrop?: boolean
  loading?: boolean
  socialStatus?: SOCIAL_STATUS
  onChange: (value: string) => void
}

export const PromptInput = ({
  btnText,
  btnIcon,
  backdrop,
  loading,
  socialStatus,
  onChange,
}: PromptInputProps) => {
  const connectedSocials = SOCIAL_PLATFORM

  return (
    <InputPrompt
      onChange={onChange}
      placeholder={[...SUGGESTED_PROMPT_TEXT]}
      socialStatus={socialStatus || SOCIAL_STATUS.OK}
      socials={[
        ...connectedSocials.map(social => ({
          icon: social.logo,
          tooltip: social.tooltip,
        })),
      ]}
      btnText={btnText}
      btnIcon={btnIcon}
      backdrop={backdrop}
      loading={loading}
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
      <div className="h-56 w-full bg-transparent md:h-44"></div>
      <div className="fixed bottom-0 flex w-[-webkit-fill-available] justify-center bg-white/60 px-5 backdrop-blur-md lg:px-0">
        <div className="flex w-full max-w-2xl flex-col gap-2 pb-8">
          {children}
          <PromptInput {...props} backdrop />
        </div>
      </div>
    </>
  )
}

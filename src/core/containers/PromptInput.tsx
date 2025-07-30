import { useRouter } from '@tanstack/react-router'
import { RotateCcw } from 'lucide-react'

import ExternalResourceChip from '@/shared/components/external-resource-chip'
import { InputPrompt } from '@/shared/components/input-prompt'

import { SOCIAL_PLATFORM, SUGGESTED_PROMPT_TEXT } from '../config/constant'

interface PromptInputProps {
  btnText?: string
  btnIcon?: React.ReactNode
  preFilledValue?: string
  backdrop?: boolean
}

export const PromptInput = ({
  btnText,
  btnIcon,
  preFilledValue,
  backdrop,
}: PromptInputProps) => {
  const router = useRouter()

  const onUserPrompt = (value: string) => {
    console.log(value)
    router.navigate({ to: '/quick-share' })
  }

  const connectedSocials = SOCIAL_PLATFORM

  return (
    <InputPrompt
      onChange={onUserPrompt}
      placeholder={[...SUGGESTED_PROMPT_TEXT]}
      socialStatus={'OK'}
      socials={[
        ...connectedSocials.map(social => ({
          icon: social.logo,
          tooltip: social.tooltip,
        })),
      ]}
      preFilledValue={preFilledValue}
      btnText={btnText}
      btnIcon={btnIcon}
      backdrop={backdrop}
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
    <div className="fixed bottom-0 flex w-[-webkit-fill-available] justify-center bg-white/60 backdrop-blur-md">
      <div className="w-full max-w-2xl pt-4 pb-8">
        {children}
        <PromptInput {...props} backdrop />
      </div>
    </div>
  )
}

import { useRouter } from '@tanstack/react-router'

import { InputPrompt } from '@/shared/components/input-prompt'

import { SOCIAL_PLATFORM, SUGGESTED_PROMPT_TEXT } from '../config/constant'

interface PromptInputProps {
  btnText?: string
  btnIcon?: React.ReactNode
  preFilledValue?: string
}

const PromptInput = ({
  btnText,
  btnIcon,
  preFilledValue,
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
    />
  )
}

export default PromptInput

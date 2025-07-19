import { InputPrompt } from '@/shared/components/input-prompt'

import { SOCIAL_PLATFORM, SUGGESTED_PROMPT_TEXT } from '../config/constant'

const PromptInput = () => {
  const onUserPrompt = (value: string) => {
    console.log(value)
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
    />
  )
}

export default PromptInput

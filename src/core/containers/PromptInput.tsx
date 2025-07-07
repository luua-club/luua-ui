import { InputPrompt } from '@/shared/components/input-prompt'

import { SUGGESTED_PROMPT_TEXT } from '../config/constant'

const PromptInput = () => {
  const onUserPrompt = (value: string) => {
    console.log(value)
  }

  return (
    <InputPrompt
      onChange={onUserPrompt}
      placeholder={[...SUGGESTED_PROMPT_TEXT]}
      socialStatus={'OK'}
    />
  )
}

export default PromptInput

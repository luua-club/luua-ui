import { LucideIcon } from 'lucide-react'

import { channelType } from './social.model'

export type PromptChipType = channelType

export interface ExamplePrompt {
  title: string
  prompt: string[]
  iconData: {
    icon: LucideIcon | React.FunctionComponent<React.SVGProps<SVGSVGElement>>
    className?: string
  }
}

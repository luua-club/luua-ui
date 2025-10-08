import { LucideIcon } from 'lucide-react'

import { SOCIAL_STATUS } from '../config/constant'

export interface InputPromptSocial {
  icon: LucideIcon
  text: string
  status: SOCIAL_STATUS
  tooltip: string
}

import React from 'react'

import { SOCIAL_STATUS } from '../config/constant'

export interface InputPromptSocial {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  text: string
  status: SOCIAL_STATUS
  tooltip: string
}

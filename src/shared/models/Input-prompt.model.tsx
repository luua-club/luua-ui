import { Icon, IconProps } from '@tabler/icons-react'

import { SOCIAL_STATUS } from '../config/constant'

export interface InputPromptSocial {
  icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>
  text: string
  status: SOCIAL_STATUS
  tooltip: string
}

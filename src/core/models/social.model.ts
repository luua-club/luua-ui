import { Icon, IconProps } from '@tabler/icons-react'
import React from 'react'

export type channelType = 'X' | 'Linkedin'

export interface ISocialChannel {
  name: channelType
  logo: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>
  tooltip: string
}

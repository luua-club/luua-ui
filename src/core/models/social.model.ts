import { Icon, IconProps } from '@tabler/icons-react'
import React from 'react'

export type channelType = 'Twitter' | 'LinkedIn'

export interface ISocialChannel {
  name: channelType
  logo: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>
  tooltip: string
}

export interface IUserConnectedChannel {
  connected: boolean
  default: boolean
  user_name: string
  user_id: string
  user_profile_picture: string
}

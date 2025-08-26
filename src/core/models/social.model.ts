import { Icon, IconProps } from '@tabler/icons-react'
import React from 'react'
import z from 'zod'

export type channelType = 'Twitter' | 'LinkedIn'

export interface ISocialChannel {
  name: channelType
  logo: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>
  tooltip: string
}

/**
 * User connected channel schema
 */
export const UserSocialSchema = z.object({
  connected: z.boolean(),
  default: z.boolean(),
  user_name: z.string(),
  user_id: z.string(),
  user_email: z.string(),
  user_profile_picture: z.string(),
})
export type UserSocial = z.infer<typeof UserSocialSchema>

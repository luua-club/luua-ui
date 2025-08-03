import { IconBrandLinkedin, IconBrandX } from '@tabler/icons-react'

import { ISocialChannel } from '../models/social.model'

/**
 * The key to store the user in local storage
 *
 * @default 'luua-user'
 */
export const LUUA_USER_KEY = import.meta.env.LUUA_USER_KEY || 'luua-user'

/**
 * Suggested text that is shown inside prompt box
 */
export const SUGGESTED_PROMPT_TEXT = [
  'Start with a prompt: Announce our weekend sale...',
  'Or paste a link to a tweet, or linkedin post you love',
  'Let Luua handle the rest...',
]

/**
 * Socials for Luua
 */
export const SOCIAL_PLATFORM: ISocialChannel[] = [
  {
    name: 'X',
    logo: IconBrandX,
    tooltip: 'Twitter / X.com',
  },
  {
    name: 'Linkedin',
    logo: IconBrandLinkedin,
    tooltip: 'Linkedin',
  },
]

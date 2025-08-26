import z from 'zod'

import { UserStyleStatus } from '../config/constant'
import { toneStyles, writingStyles } from '../config/user-preferences.config'
import { UserSocialSchema } from './social.model'

/**
 * User schema
 */
export const UserSchema = z.object({
  email: z.string(),
  name: z.string(),
  profile_image: z.string(),
  deactivated: z.boolean(),
  connected_channels: z.object({
    linkedin: UserSocialSchema,
    twitter: UserSocialSchema,
  }),
})
export type User = z.infer<typeof UserSchema>

/**
 * User state interface
 */
export interface UserState extends User {
  logout: () => void
}

/**
 * User style response schema
 */
export const UserStyleResponseSchema = z.object({
  source_length: z.number(),
  source_count: z.number(),
  style_gen_state: z.enum(UserStyleStatus).default(UserStyleStatus.INITIAL),
  writing_style: z
    .array(z.string())
    .transform(arr =>
      arr
        .map(val => writingStyles.find(style => style.title === val)?.title)
        .filter(v => v !== undefined)
    )
    .nullish(),
  tone: z
    .array(z.string())
    .transform(arr =>
      arr
        .map(val => toneStyles.find(style => style.title === val)?.title)
        .filter(v => v !== undefined)
    )
    .nullish(),
  style_tags: z.array(z.string()).nullish(),
})
export type userStyleResponseType = z.infer<typeof UserStyleResponseSchema>

/**
 * User advanced style request interface
 */
export interface IUserAdvancedStyleRequest {
  style_text?: string
  gcp_storage_doc_ids?: string[]
}

/**
 * User style request interface
 */
export interface IUserStyleRequest {
  writing_style?: string[]
  tone?: string[]
}

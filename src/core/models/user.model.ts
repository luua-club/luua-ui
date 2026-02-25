import z from 'zod'

import { UserStyleStatus } from '../config/constant'
import { writingStyles } from '../config/user-preferences.config'
import { OrganizationSchema, ProjectSchema } from './org.model'
import { UserSocialSchema } from './social.model'

/**
 * User schema
 */
export const UserSchema = z.object({
  id: z.string().optional(),
  email: z.string(),
  name: z.string(),
  profile_image: z.string().nullable(),
  deactivated: z.boolean(),
  plan: z.enum(['Free', 'Pro']).catch('Free'),
  connected_channels: z
    .object({
      linkedin: UserSocialSchema,
      twitter: UserSocialSchema,
    })
    .catch({
      linkedin: {
        connected: false,
        default: false,
        user_name: '',
        user_id: '',
        user_email: '',
        user_profile_picture: null,
        meta: {
          pages: [],
          account_type: null,
          organization_id: null,
          organizaion_name: null,
          organization_name: null,
          organization_profile_image: null,
        },
      },
      twitter: {
        connected: false,
        default: false,
        user_name: '',
        user_id: '',
        user_email: '',
        user_profile_picture: null,
        meta: {
          pages: [],
          account_type: null,
          organization_id: null,
          organizaion_name: null,
          organization_name: null,
          organization_profile_image: null,
        },
      },
    }),
  organizations: z.array(OrganizationSchema).catch([]),
  projects: z.array(ProjectSchema).catch([]),
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
        .map(val => writingStyles.find(style => style.id === val))
        .filter(v => v !== undefined)
    ),
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
  writing_style: string[]
}

/**
 * User onboarding request interface
 */
export interface UserOnboardingRequest {
  role?: string
  industry?: string
  goal?: string
}

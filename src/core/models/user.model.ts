import z from 'zod'

import { UserStyleStatus } from '../config/constant'
import { writingStyles } from '../config/user-preferences.config'
import {
  type BillingPlan,
  OrganizationSummarySchema,
  ProjectSchema,
} from './org.model'

/**
 * User schema
 */
export const UserSchema = z.object({
  id: z.string().optional(),
  email: z.string(),
  name: z.string(),
  profile_image: z.string().nullable(),
  deactivated: z.boolean(),
  has_pending_invites: z.boolean().optional(),
  organizations: z.array(OrganizationSummarySchema).catch([]),
  projects: z.array(ProjectSchema).catch([]),
})
export type User = z.infer<typeof UserSchema>

/**
 * User state interface (plan comes from currentOrg, injected by useUserState hook)
 */
export interface UserState extends User {
  plan: BillingPlan
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

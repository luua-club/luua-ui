import z from 'zod'

import { OrganizationDetailSchema, ProjectDetailSchema } from './org.model'
import { UserSchema } from './user.model'

/**
 * Login request schema
 */
export const LoginRequestSchema = z.object({
  token: z.string(),
})
export type LoginRequest = z.infer<typeof LoginRequestSchema>

/**
 * Login response schema
 */
export const LoginResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  new_user: z.boolean(),
  user: UserSchema.optional(),
})
export type LoginResponse = z.infer<typeof LoginResponseSchema>

/**
 * Full auth info stored in localStorage under LUUA_AUTH_INFO_KEY.
 * user/currentOrg/currentProject are optional during the partial write phase
 * (token saved first, then populated after the 3-API cascade).
 */
export const AuthInfoSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  new_user: z.boolean().optional(),
  user: UserSchema.optional(),
  currentOrg: OrganizationDetailSchema.optional(),
  currentProject: ProjectDetailSchema.optional(),
})
export type AuthInfo = z.infer<typeof AuthInfoSchema>

/**
 * Magic link request schema
 */
export const MagicLinkRequestSchema = z.object({
  email: z.string().email(),
})
export type MagicLinkRequest = z.infer<typeof MagicLinkRequestSchema>

/**
 * Magic link response schema
 */
export const MagicLinkResponseSchema = z.object({
  email: z.string().email(),
})
export type MagicLinkResponse = z.infer<typeof MagicLinkResponseSchema>

/**
 * Magic link verify request schema
 */
export const MagicLinkVerifyRequestSchema = z.object({
  token: z.string(),
})
export type MagicLinkVerifyRequest = z.infer<
  typeof MagicLinkVerifyRequestSchema
>

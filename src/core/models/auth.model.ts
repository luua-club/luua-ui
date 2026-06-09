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
 * Login response schema.
 * With cookie-based auth the backend sets an httpOnly cookie and returns only
 * whether this is a freshly-created user — no token is sent to the client.
 */
export const LoginResponseSchema = z.object({
  new_user: z.boolean(),
})
export type LoginResponse = z.infer<typeof LoginResponseSchema>

/**
 * Non-sensitive auth cache stored in localStorage under LUUA_AUTH_INFO_KEY.
 *
 * The httpOnly cookie is the source of truth for authentication; this cache
 * only holds the resolved user/org/project (populated after the 3-API cascade)
 * and doubles as a synchronous "logged-in" hint for the router guard.
 * All fields are optional during the partial write phase of the cascade.
 */
export const AuthInfoSchema = z.object({
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

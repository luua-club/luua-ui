import z from 'zod'

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
})
export type LoginResponse = z.infer<typeof LoginResponseSchema>

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

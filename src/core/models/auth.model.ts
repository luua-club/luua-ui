import z from 'zod'

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
  user: UserSchema,
})
export type LoginResponse = z.infer<typeof LoginResponseSchema>

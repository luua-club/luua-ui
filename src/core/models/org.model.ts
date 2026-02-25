import z from 'zod'

/**
 * Organization schema from profile API
 */
export const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string().default(''),
  status: z.string().default(''),
  org_role: z.string().default(''),
  plan: z.enum(['Free', 'Pro']).catch('Free'),
  seat_limit: z.number(),
  seat_used: z.number(),
})
export type Organization = z.infer<typeof OrganizationSchema>

/**
 * Project schema from profile API
 */
export const ProjectSchema = z.object({
  id: z.string(),
  org_id: z.string(),
  name: z.string().default(''),
  status: z.string().default(''),
  project_role: z.string().default(''),
})
export type Project = z.infer<typeof ProjectSchema>

/**
 * Member schema for org/project members
 */
export const MemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  profile_image: z.string().nullable(),
  role: z.string(),
  joined_at: z.string(),
})
export type Member = z.infer<typeof MemberSchema>

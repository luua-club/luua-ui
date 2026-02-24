import z from 'zod'

/**
 * Organization schema from profile API
 */
export const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string().default(''),
  slug: z.string().default(''),
  status: z.string().default(''),
  org_role: z.string().default(''),
  plan: z.enum(['Free', 'Pro']).catch('Free'),
})
export type Organization = z.infer<typeof OrganizationSchema>

/**
 * Project schema from profile API
 */
export const ProjectSchema = z.object({
  id: z.string(),
  org_id: z.string(),
  name: z.string().default(''),
  slug: z.string().default(''),
  status: z.string().default(''),
  project_role: z.string().default(''),
})
export type Project = z.infer<typeof ProjectSchema>

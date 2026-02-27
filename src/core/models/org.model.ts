import z from 'zod'

import { ProjectSocialSchema } from './social.model'

/**
 * Connected channels schema (linkedin + twitter)
 */
export const ConnectedChannelsSchema = z.object({
  linkedin: ProjectSocialSchema,
  twitter: ProjectSocialSchema,
})
export type ConnectedChannels = z.infer<typeof ConnectedChannelsSchema>

/**
 * Organization summary schema from /user/profile
 */
export const OrganizationSummarySchema = z.object({
  id: z.string(),
  name: z.string().default(''),
  status: z.string().default(''),
  org_role: z.string().default(''),
})
export type OrganizationSummary = z.infer<typeof OrganizationSummarySchema>

/**
 * Organization detail schema from /organizations/current
 */
export const OrganizationDetailSchema = OrganizationSummarySchema.extend({
  plan: z.enum(['Free', 'Pro']).catch('Free'),
  seat_limit: z.number(),
  seat_used: z.number(),
})
export type OrganizationDetail = z.infer<typeof OrganizationDetailSchema>

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
 * Project detail schema from /projects/current (includes connected channels)
 */
export const ProjectDetailSchema = ProjectSchema.extend({
  connected_channels: ConnectedChannelsSchema,
})
export type ProjectDetail = z.infer<typeof ProjectDetailSchema>

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

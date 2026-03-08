import React from 'react'
import z from 'zod'

export type channelType = 'Twitter' | 'LinkedIn' | 'Instagram' | 'Bluesky'
export type LinkedInAccountType = 'personal' | 'page'

export interface ISocialChannel {
  name: channelType
  label: string
  logo: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  tooltip: string
}

export const InstagramAccountSchema = z.object({
  instagram_business_account_id: z.string(),
  ig_username: z.string(),
  ig_name: z.string(),
  ig_profile_picture_url: z.string().nullable().optional().default(null),
  page_id: z.string(),
  page_name: z.string(),
})
export type InstagramAccount = z.infer<typeof InstagramAccountSchema>

const LinkedInPageSchema = z.object({
  id: z.string(),
  name: z.string(),
  profile_image: z.string().nullable().optional().default(null),
})

const LinkedInMetaSchema = z
  .object({
    pages: z.array(LinkedInPageSchema).optional().default([]),
    account_type: z
      .enum(['personal', 'page'])
      .nullable()
      .optional()
      .default(null),
    organization_id: z.string().nullable().optional().default(null),
    organizaion_name: z.string().nullable().optional().default(null),
    organization_name: z.string().nullable().optional().default(null),
    organization_profile_image: z.string().nullable().optional().default(null),
  })
  .passthrough()

/**
 * Project connected channel schema
 */
export const ProjectSocialSchema = z.object({
  connected: z.boolean(),
  default: z.boolean(),
  user_name: z.string(),
  user_id: z.string(),
  user_email: z.string(),
  user_profile_picture: z.string().nullable(),
  // Currently we only have meta for LinkedIn, later on we can extend this for different socials
  meta: LinkedInMetaSchema.optional().default({
    pages: [],
    account_type: null,
    organization_id: null,
    organizaion_name: null,
    organization_name: null,
    organization_profile_image: null,
  }),
})
export type ProjectSocial = z.infer<typeof ProjectSocialSchema>

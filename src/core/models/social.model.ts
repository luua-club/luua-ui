import React from 'react'
import z from 'zod'

export type channelType = 'Twitter' | 'LinkedIn' | 'Instagram'
export type LinkedInAccountType = 'personal' | 'page'
export type InstagramAccountType = 'BUSINESS' | 'MEDIA_CREATOR'

export interface ISocialChannel {
  name: channelType
  label: string
  logo: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  tooltip: string
  colors: {
    chart: {
      light: string
      dark: string
    }
  }
}

const LinkedInPageSchema = z.object({
  id: z.string(),
  name: z.string(),
  profile_image: z.string().nullable().optional().default(null),
})

const SocialMetaSchema = z
  .object({
    pages: z.array(LinkedInPageSchema).optional().default([]),
    account_type: z
      .enum(['personal', 'page', 'BUSINESS', 'MEDIA_CREATOR'])
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
  meta: SocialMetaSchema.optional().default({
    pages: [],
    account_type: null,
    organization_id: null,
    organizaion_name: null,
    organization_name: null,
    organization_profile_image: null,
  }),
})
export type ProjectSocial = z.infer<typeof ProjectSocialSchema>

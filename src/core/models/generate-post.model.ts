import { z } from 'zod'

import { channelType } from './social.model'

export interface IGeneratePostRequest {
  user_prompt: string
  base_input?: string | null
  post_channels?: channelType[]
  is_search_enabled: boolean
  session_id?: string
}

// Zod schema for extracted links
export const ExtractedLinksSchema = z.object({
  url: z.url('Must be a valid URL'),
  content: z.string(),
})

export type extractedLinksType = z.infer<typeof ExtractedLinksSchema>

// Zod schema for generate post response
export const GeneratePostResponseSchema = z.object({
  original_prompt: z.string(),
  external_sources: z.array(ExtractedLinksSchema),
  generated_twitter_post: z.object({
    content: z.string(),
  }),
  generated_linkedin_post: z.object({
    content: z.string(),
  }),
  session_id: z.string(),
})

export type generatePostResponseType = z.infer<
  typeof GeneratePostResponseSchema
>

import { z } from 'zod'

import { channelType } from './social.model'

export interface IGeneratePostRequest {
  user_prompt: string
  current_state?: {
    linkedin: string | null
    twitter: string | null
  } | null
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

// Zod schema for search sources
export const SearchSourcesSchema = z.object({
  query: z.string(),
  results: z.string(),
})

export type searchSourcesType = z.infer<typeof SearchSourcesSchema>

// Zod schema for generate post response
export const GeneratePostResponseSchema = z.object({
  original_prompt: z.string(),
  session_id: z.string(),
  fallback_message: z.string().nullable(),
  external_sources: z.array(ExtractedLinksSchema).nullable(),
  generated_twitter_post: z
    .object({
      content: z.string(),
    })
    .nullable(),
  generated_linkedin_post: z
    .object({
      content: z.string(),
    })
    .nullable(),
  search_sources: z.array(SearchSourcesSchema).nullable(),
})

export type generatePostResponseType = z.infer<
  typeof GeneratePostResponseSchema
>

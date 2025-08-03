import { z } from 'zod'

import { channelType } from './social.model'

export interface IGeneratePostRequest {
  user_prompt: string
  input_text?: string
  channel?: channelType
}

// Zod schema for extracted links
export const ExtractedLinksSchema = z.object({
  url: z.url('Must be a valid URL'),
  title: z.string(),
})

export type extractedLinksType = z.infer<typeof ExtractedLinksSchema>

// Zod schema for generate post response
export const GeneratePostResponseSchema = z.object({
  original_prompt: z.string(),
  base_text: z.string(),
  extracted_links: z.array(ExtractedLinksSchema),
  generated_twitter_post: z.object({
    content: z.string(),
  }),
  generated_linkedin_post: z.object({
    content: z.string(),
  }),
})

export type generatePostResponseType = z.infer<
  typeof GeneratePostResponseSchema
>

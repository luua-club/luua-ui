import { ICommonUrlTitle } from './common-url-title.model'
import { channelType } from './social.model'

export interface IGeneratePostRequest {
  user_prompt: string
  input_text?: string
  channel?: channelType
}

export interface IGeneratePostResponse {
  original_prompt: string
  base_text: string
  extracted_links: ICommonUrlTitle[]
  generated_twitter_post: {
    content: string
  }
  generated_linkedin_post: {
    content: string
  }
}

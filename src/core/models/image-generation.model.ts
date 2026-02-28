export interface ImageTemplate {
  id: string
  name: string
  description: string
  category: string
  base_prompt: string
  image_size: string
  thumbnail_url: string
}

export interface ImageGenerateRequest {
  template_id: string
  custom_prompt?: string
  image_size?: string
  custom_instruction?: string
}

export interface ImageGenerateResponse {
  image_url: string
  credits_consumed: number
}

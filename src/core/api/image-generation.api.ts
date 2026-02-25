import {
  ImageGenerateRequest,
  ImageGenerateResponse,
  ImageTemplate,
} from '../models/image-generation.model'
import { BaseApiService } from './base.api'

class ImageGenerationApi extends BaseApiService {
  constructor() {
    super('/generate/image')
  }

  async getTemplates() {
    return this.get<ImageTemplate[]>('/templates')
  }

  async generateImage(data: ImageGenerateRequest, signal?: AbortSignal) {
    return this.post<ImageGenerateResponse>(data, '/', {
      timeout: 120000,
      signal,
    })
  }
}

export const imageGenerationApi = new ImageGenerationApi()

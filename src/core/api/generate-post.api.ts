import {
  generatePostResponseType,
  IGeneratePostRequest,
} from '../models/generate-post.model'
import { BaseApiService } from './base.api'

class GenerateApi extends BaseApiService {
  constructor() {
    super('/generate/')
  }

  async generatePost(data: IGeneratePostRequest, signal?: AbortSignal) {
    return this.post<generatePostResponseType>(data, undefined, { signal })
  }
}

export const generateApi = new GenerateApi()

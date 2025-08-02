import {
  IGeneratePostRequest,
  IGeneratePostResponse,
} from '../models/generate-post.model'
import { BaseApiService } from './base.api'

class GenerateApi extends BaseApiService {
  constructor() {
    super('/generate/')
  }

  async generatePost(data: IGeneratePostRequest, signal?: AbortSignal) {
    return this.post<IGeneratePostResponse>(data, undefined, { signal })
  }
}

export const generateApi = new GenerateApi()

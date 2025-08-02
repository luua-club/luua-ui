import {
  IGeneratePostRequest,
  IGeneratePostResponse,
} from '../models/generate-post.model'
import { BaseApiService } from './base.api'

class GenerateApi extends BaseApiService {
  constructor() {
    super('/generate/')
  }

  async generatePost(data: IGeneratePostRequest) {
    return this.post<IGeneratePostResponse>(data)
  }
}

export const generateApi = new GenerateApi()

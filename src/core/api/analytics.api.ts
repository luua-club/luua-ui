import { ApiResponse } from '../models/api.model'
import { IAnalyticsResponse } from '../models/post.model'
import { BaseApiService } from './base.api'

class AnalyticsApi extends BaseApiService {
  constructor() {
    super('/analytics')
  }

  async getDashboard(): Promise<ApiResponse<IAnalyticsResponse>> {
    return this.get<IAnalyticsResponse>('/dashboard')
  }
}

export const analyticsApi = new AnalyticsApi()

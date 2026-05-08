import {
  IAnalyticsActivityRequest,
  IAnalyticsActivityResponse,
  IAnalyticsBreakdownResponse,
  IAnalyticsDateRangeRequest,
  IAnalyticsOverviewResponse,
  IAnalyticsPostsRequest,
  IAnalyticsPostsResponse,
} from '../models/analytics.model'
import { BaseApiService } from './base.api'

class AnalyticsApi extends BaseApiService {
  constructor() {
    super('/analytics')
  }

  async getOverview(
    req: IAnalyticsDateRangeRequest = {}
  ): Promise<IAnalyticsOverviewResponse> {
    const response = await this.get<IAnalyticsOverviewResponse>('/overview', {
      params: this.toParams(req),
    })

    return response.data
  }

  async getBreakdown(
    req: IAnalyticsDateRangeRequest = {}
  ): Promise<IAnalyticsBreakdownResponse> {
    const response = await this.get<IAnalyticsBreakdownResponse>('/breakdown', {
      params: this.toParams(req),
    })

    return response.data
  }

  async getActivity(
    req: IAnalyticsActivityRequest = {}
  ): Promise<IAnalyticsActivityResponse> {
    const response = await this.get<IAnalyticsActivityResponse>('/activity', {
      params: this.toParams(req),
    })

    return response.data
  }

  async getPosts(
    req: IAnalyticsPostsRequest = {}
  ): Promise<IAnalyticsPostsResponse> {
    const response = await this.get<IAnalyticsPostsResponse>('/posts', {
      params: req,
    })

    return response.data
  }

  private toParams<T extends { channels?: readonly string[] }>(req: T) {
    const { channels, ...params } = req

    return {
      ...params,
      channels: channels?.join(','),
    }
  }
}

export const analyticsApi = new AnalyticsApi()

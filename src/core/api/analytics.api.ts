import { format, subDays } from 'date-fns'

import {
  IAnalyticsPostHistoryRequest,
  IAnalyticsPostHistoryResponse,
  IAnalyticsPostsRequest,
  IAnalyticsPostsResponse,
  ICommonAnalyticsData,
} from '../models/analytics.model'
import { ApiResponse } from '../models/api.model'
import { BaseApiService } from './base.api'

const ANALYTICS_PAGE_LIMIT = 100
const HISTORY_WINDOW_DAYS = 30

class AnalyticsApi extends BaseApiService {
  constructor() {
    super('/analytics')
  }

  async getPosts(
    req: IAnalyticsPostsRequest = {}
  ): Promise<ApiResponse<IAnalyticsPostsResponse>> {
    return this.get<IAnalyticsPostsResponse>('/posts', { params: req })
  }

  async getPostHistory(
    postId: string,
    req: IAnalyticsPostHistoryRequest = {}
  ): Promise<ApiResponse<IAnalyticsPostHistoryResponse>> {
    return this.get<IAnalyticsPostHistoryResponse>(
      `/posts/${encodeURIComponent(postId)}/history`,
      { params: req }
    )
  }

  async getCommonAnalytics(): Promise<ICommonAnalyticsData> {
    const endDate = format(new Date(), 'yyyy-MM-dd')
    const startDate = format(
      subDays(new Date(), HISTORY_WINDOW_DAYS - 1),
      'yyyy-MM-dd'
    )
    const postsResponse = await this.getPosts({
      limit: ANALYTICS_PAGE_LIMIT,
      offset: 0,
      sort_by: 'published_at',
      sort_order: 'desc',
    })
    const posts = [...postsResponse.data.posts]
    const total = postsResponse.data.total

    for (
      let offset = postsResponse.data.offset + postsResponse.data.limit;
      offset < total;
      offset += ANALYTICS_PAGE_LIMIT
    ) {
      const pageResponse = await this.getPosts({
        limit: ANALYTICS_PAGE_LIMIT,
        offset,
        sort_by: 'published_at',
        sort_order: 'desc',
      })

      posts.push(...pageResponse.data.posts)
    }

    const histories = await Promise.all(
      posts.map(post =>
        this.getPostHistory(post.post_id, {
          start_date: startDate,
          end_date: endDate,
        }).then(response => response.data)
      )
    )

    return {
      posts,
      total,
      histories,
      startDate,
      endDate,
    }
  }
}

export const analyticsApi = new AnalyticsApi()

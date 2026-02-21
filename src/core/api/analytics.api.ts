import { ApiResponse } from '../models/api.model'
import { IAnalyticsResponse } from '../models/post.model'
import { BaseApiService } from './base.api'

const MOCK_RESPONSE: IAnalyticsResponse = {
  period_start: '2026-01-22',
  period_end: '2026-02-21',
  total_posts: 42,
  metrics: [
    {
      label: 'Likes',
      value: 1400,
      change_percent: 12.5,
      daily_data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 86400000)
          .toISOString()
          .slice(0, 10),
        value: Math.floor(30 + Math.random() * 80),
      })),
    },
    {
      label: 'Comments',
      value: 129,
      change_percent: -3.2,
      daily_data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 86400000)
          .toISOString()
          .slice(0, 10),
        value: Math.floor(2 + Math.random() * 10),
      })),
    },
    {
      label: 'Reposts',
      value: 87,
      change_percent: 5.1,
      daily_data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 86400000)
          .toISOString()
          .slice(0, 10),
        value: Math.floor(1 + Math.random() * 8),
      })),
    },
    {
      label: 'Engagement Rate',
      value: 3.2,
      change_percent: 1.4,
      daily_data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 86400000)
          .toISOString()
          .slice(0, 10),
        value: parseFloat((1.5 + Math.random() * 3).toFixed(2)),
      })),
    },
  ],
}

class AnalyticsApi extends BaseApiService {
  constructor() {
    super('/analytics')
  }

  async getDashboard(): Promise<ApiResponse<IAnalyticsResponse>> {
    // TODO: remove mock
    return new Promise(resolve =>
      setTimeout(
        () => resolve({ data: MOCK_RESPONSE, status: 200, message: 'OK' }),
        800
      )
    )
    // return this.get<IAnalyticsResponse>('/dashboard')
  }
}

export const analyticsApi = new AnalyticsApi()

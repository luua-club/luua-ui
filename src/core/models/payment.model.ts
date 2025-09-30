export interface PaymentLinkResponse {
  payment_link: string
}

export interface ISubscriptionDetails {
  id: string
  status: string
  started_at: string
  expires_at: string
}

export interface ISubscriptionDetailsResponse {
  subscriptions: ISubscriptionDetails[]
}

export interface IUsageResponse {
  usage_summary: IUsageSummary
}

export interface IUsageSummary {
  cycle_id: string
  plan_type: string
  status: string
  credits: {
    total: number
    consumed: number
    remaining: number
  }
  limits: {
    scheduled_posts: {
      total: number
      used: number
      remaining: number
    }
    auto_pilot_posts: {
      total: number
      used: number
      remaining: number
    }
  }
  cycle_period: {
    start_date: string
    end_date: string
  }
}

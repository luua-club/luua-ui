export interface PaymentLinkResponse {
  payment_link: string
}

export interface PaymentSuccessResponse {
  message?: string
}

export type PurchasablePlan = 'Pro' | 'Team'
export type SubscriptionType = 'monthly' | 'annual'

export interface CreatePaymentLinkRequest {
  plan: PurchasablePlan
  subscription_type: SubscriptionType
}

export interface ISubscriptionDetails {
  id: string
  plan: 'Free' | 'Pro' | 'Team' | 'Enterprise'
  status: string
  started_at: string | null
  expires_at: string | null
  cancelled_at: string | null
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

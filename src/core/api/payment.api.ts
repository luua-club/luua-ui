import {
  CreatePaymentLinkRequest,
  ISubscriptionDetailsResponse,
  IUsageResponse,
  PaymentLinkResponse,
  PaymentSuccessResponse,
} from '../models/payment.model'
import { BaseApiService } from './base.api'

class PaymentApi extends BaseApiService {
  constructor() {
    super('/payments')
  }

  /**
   * Get subscription details
   *
   * @returns Promise<ISubscriptionDetails>
   */
  async getSubscriptionDetails() {
    return this.get<ISubscriptionDetailsResponse>('/subscription')
  }

  /**
   * Create a checkout payment link for a subscription plan
   *
   * @returns Promise<PaymentLinkResponse>
   */
  async createPaymentLink(data: CreatePaymentLinkRequest) {
    return this.post<PaymentLinkResponse, CreatePaymentLinkRequest>(
      data,
      '/create-payment-link'
    )
  }

  /**
   * Cancel the current org subscription
   *
   * @returns Promise<PaymentSuccessResponse>
   */
  async cancelSubscription() {
    return this.post<PaymentSuccessResponse, Record<string, never>>(
      {},
      '/cancel-subscription'
    )
  }

  /**
   * Get usage summary
   *
   * @returns Promise<IUsageResponse>
   */
  async getUsage() {
    return this.get<IUsageResponse>('/usage-summary')
  }
}

export const paymentApi = new PaymentApi()

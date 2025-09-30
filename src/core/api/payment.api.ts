import {
  ISubscriptionDetailsResponse,
  IUsageResponse,
  PaymentLinkResponse,
} from '../models/payment.model'
import { BaseApiService } from './base.api'

class PaymentApi extends BaseApiService {
  constructor() {
    super('/payments')
  }

  /**
   * Create a payment link
   *
   * @returns Promise<PaymentLinkResponse>
   */
  async createPaymentLink() {
    return this.post<PaymentLinkResponse>({}, '/create-payment-link')
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
   * Cancel subscription
   *
   * @returns Promise<void>
   */
  async cancelSubscription() {
    return this.post<void>({}, '/cancel-subscription')
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

import {
  ISubscriptionDetailsResponse,
  IUsageResponse,
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
   * Get usage summary
   *
   * @returns Promise<IUsageResponse>
   */
  async getUsage() {
    return this.get<IUsageResponse>('/usage-summary')
  }
}

export const paymentApi = new PaymentApi()

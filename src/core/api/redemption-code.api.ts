import {
  type RedeemCodeRequest,
  type RedeemCodeResponse,
} from '../models/payment.model'
import { BaseApiService } from './base.api'

class RedemptionCodeApi extends BaseApiService {
  constructor() {
    super('/redemption-codes')
  }

  /**
   * Redeem an invite code for the current organization.
   *
   * @returns Promise<RedeemCodeResponse>
   */
  async redeemCode(data: RedeemCodeRequest) {
    return this.post<RedeemCodeResponse, RedeemCodeRequest>(data, '/redeem')
  }
}

export const redemptionCodeApi = new RedemptionCodeApi()

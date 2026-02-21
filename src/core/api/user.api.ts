import { channelType, LinkedInAccountType } from '../models/social.model'
import {
  IUserStyleRequest,
  User,
  UserOnboardingRequest,
  userStyleResponseType,
} from '../models/user.model'
import { BaseApiService } from './base.api'

class UserApi extends BaseApiService {
  constructor() {
    super('/user')
  }

  /**
   * Get the user profile
   *
   * @returns Promise<ApiResponse<IUser>> The user profile
   */
  async getUser() {
    return this.get<User>('/profile')
  }

  /**
   * Get the user style
   *
   * @returns Promise<ApiResponse<userStyleResponseType>> The user style
   */
  async getUserStyle() {
    return this.get<userStyleResponseType>('/user_style_prefs')
  }

  /**
   * Set the user style
   *
   * @param data - The user style request data
   * @returns Promise<ApiResponse<userStyleResponseType>> The response from the server
   */
  async setUserStyle(data: IUserStyleRequest) {
    return this.post<userStyleResponseType>(data, '/user_style_prefs')
  }

  /**
   * Disconnect the user from a social platform
   *
   * @param platform - The social platform to disconnect from
   * @returns Promise<ApiResponse<void>> The response from the server
   */
  async disconnectSocial(platform: channelType) {
    return this.patch({ channel: platform }, '/disconnect-social')
  }

  /**
   * Set the LinkedIn posting target (person/page)
   *
   * @param data - LinkedIn target payload
   * @returns Promise<ApiResponse<void>> The response from the server
   */
  async setLinkedInTarget(data: {
    account_type: LinkedInAccountType
    organization_id: string | null
  }) {
    return this.patch<void, typeof data>(data, '/linkedin-target')
  }

  /**
   * Set the user onboarding
   
   * @param data - The user onboarding request data
   * @returns Promise<ApiResponse<unknown>> The response from the server
   */
  async onboarding(data: UserOnboardingRequest) {
    return this.post(data, '/onboarding')
  }

  /**
   * Delete the user account
   *
   * @returns Promise<ApiResponse<void>> The response from the server
   */
  async deleteAccount() {
    return this.post({}, '/delete-account')
  }

  /**
   * Reset the user style
   *
   * @returns Promise<ApiResponse<void>> The response from the server
   */
  async resetUserStyle() {
    return this.post({}, '/reset_style')
  }
}

export const userApi = new UserApi()

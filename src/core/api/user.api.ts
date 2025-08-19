import { channelType } from '../models/social.model'
import {
  IUser,
  IUserStyleRequest,
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
    return this.get<IUser>('/profile')
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
}

export const userApi = new UserApi()

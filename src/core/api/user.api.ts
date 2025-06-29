import { IUser } from '../models/user.model'
import { BaseApiService } from './base.api'

class UserApi extends BaseApiService {
  constructor() {
    super('/user')
  }

  /**
   * Get the user profile
   *
   * @returns The user profile
   */
  async getUser() {
    return this.get<IUser>('/profile')
  }
}

export const userApi = new UserApi()

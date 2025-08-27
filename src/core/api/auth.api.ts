import { LoginRequest, LoginResponse } from '../models/auth.model'
import { BaseApiService } from './base.api'

class AuthApi extends BaseApiService {
  constructor() {
    super('/auth')
  }

  /**
   * Authenticates a user using a Google OAuth token.
   *
   * @param token - The login request containing the Google OAuth token.
   * @returns A promise resolving to the authentication response containing user data and JWT.
   */
  async login(token: LoginRequest) {
    return this.post<LoginResponse>(token, '/login/google')
  }
}

export const authApi = new AuthApi()

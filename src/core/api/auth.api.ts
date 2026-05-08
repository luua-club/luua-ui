import {
  type LoginRequest,
  type LoginResponse,
  type MagicLinkRequest,
  type MagicLinkResponse,
  type MagicLinkVerifyRequest,
} from '../models/auth.model'
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

  /**
   * Requests a magic link OTP to be sent to the user's email.
   *
   * @param data - The magic link request containing the user's email.
   * @returns A promise resolving to the magic link response.
   */
  async requestMagicLink(data: MagicLinkRequest) {
    return this.post<MagicLinkResponse>(data, '/login/email')
  }

  /**
   * Verifies the magic link OTP token.
   *
   * @param data - The verify request containing the OTP token.
   * @returns A promise resolving to the authentication response containing user data and JWT.
   */
  async verifyMagicLink(data: MagicLinkVerifyRequest) {
    return this.post<LoginResponse>(data, '/login/email/verify')
  }
}

export const authApi = new AuthApi()

import { BaseApiService } from './base.api'

class OAuthApi extends BaseApiService {
  constructor() {
    super('/oauth')
  }

  /**
   * Initiates LinkedIn OAuth authorization flow.
   *
   * @returns A promise resolving to the LinkedIn authorization URL.
   */
  async linkedinAuthorize() {
    return this.get<{ authorization_url: string }>('/linkedin/authorize', {
      params: {
        redirect_to: window.location.href,
      },
    })
  }

  /**
   * Initiates Twitter OAuth authorization flow.
   *
   * @returns A promise resolving to the Twitter authorization URL.
   */
  async twitterAuthorize() {
    return this.get<{ authorization_url: string }>('/twitter/authorize', {
      params: {
        redirect_to: window.location.href,
      },
    })
  }
}

export const oauthApi = new OAuthApi()

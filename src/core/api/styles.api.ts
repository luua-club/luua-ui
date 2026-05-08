import { type IUserAdvancedStyleRequest } from '../models/user.model'
import { BaseApiService } from './base.api'

class StylesApi extends BaseApiService {
  constructor() {
    super('/style')
  }

  /**
   * Set the user advanced style
   *
   * @param data - The user style request data
   * @returns Promise<ApiResponse<{ status: string }>> The response from the server
   */
  async setUserAdvancedStyle(data: IUserAdvancedStyleRequest) {
    return this.post<{ status: string }>(data, '/generate/text_style')
  }
}

export const stylesApi = new StylesApi()

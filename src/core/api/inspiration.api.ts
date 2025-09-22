import { InspirationResponse } from '../models/inspiration.model'
import { BaseApiService } from './base.api'

class InspirationApi extends BaseApiService {
  constructor() {
    super('/inspirations')
  }

  /**
   * Get inspirations
   *
   * @param req - Request parameters
   * @returns Promise<InspirationResponse>
   */
  async getInspirations(req: { limit?: number; offset?: number }) {
    const { limit, offset } = req

    return this.get<InspirationResponse>('/', {
      params: { limit, offset, sort_order: 'desc' },
    })
  }

  /**
   * Create inspiration
   *
   * @param req - Request parameters
   * @returns Promise<InspirationResponse>
   */
  async createInspiration(req: {
    link: string
    additional_context: string | null
  }) {
    return this.post(req)
  }

  /**
   * Update inspiration
   *
   * @param id - Inspiration ID
   * @param req - Request parameters
   * @returns Promise<InspirationResponse>
   */
  async updateInspiration(
    id: string,
    req: { link: string; additional_context: string | null }
  ) {
    return this.patch(req, `/${id}`)
  }

  /**
   * Delete inspiration
   *
   * @param id - Inspiration ID
   * @returns Promise<void>
   */
  async deleteInspiration(id: string) {
    return this.delete(`/${id}`)
  }
}

export const inspirationApi = new InspirationApi()

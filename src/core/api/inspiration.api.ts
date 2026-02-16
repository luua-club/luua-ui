import { Inspiration, InspirationResponse } from '../models/inspiration.model'
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
  async getInspirations(
    req: { limit?: number; offset?: number },
    signal?: AbortSignal
  ) {
    const { limit, offset } = req

    return this.get<InspirationResponse>(undefined, {
      params: { limit, offset, sort_order: 'desc' },
      signal,
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
   * Get a single inspiration by ID
   *
   * @param id - Inspiration ID
   * @returns Promise<Inspiration>
   */
  async getInspiration(id: string, signal?: AbortSignal) {
    return this.get<Inspiration>(`/${id}`, { signal })
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

import { Organization } from '../models/org.model'
import { BaseApiService } from './base.api'

class OrgApi extends BaseApiService {
  constructor() {
    super('/organizations')
  }

  /**
   * Get org details (plan, etc.) for the currently selected org.
   * Requires x-luua-org-id header (set by interceptor).
   */
  async getOrgDetails() {
    return this.get<Organization>('/')
  }
}

export const orgApi = new OrgApi()

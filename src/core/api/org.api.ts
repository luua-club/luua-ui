import { Member, OrganizationDetail } from '../models/org.model'
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
    return this.get<OrganizationDetail>('/current')
  }

  /**
   * Update org details (e.g. rename).
   */
  async updateOrg(data: { name?: string }) {
    return this.patch<OrganizationDetail>(data, '/current')
  }

  /**
   * Get members of the currently selected org.
   */
  async getOrgMembers() {
    return this.get<Member[]>('/current/members')
  }
}

export const orgApi = new OrgApi()

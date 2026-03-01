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

  /**
   * Remove a member from the currently selected org.
   */
  async removeMember(userId: string) {
    return this.post<void>({ user_id: userId }, '/current/members/remove')
  }

  /**
   * Change the role of a member in the currently selected org.
   */
  async changeMemberRole(userId: string, role: 'admin' | 'member') {
    return this.patch<void>({ user_id: userId, role }, '/current/members/role')
  }
}

export const orgApi = new OrgApi()

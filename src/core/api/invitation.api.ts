import { BaseApiService } from './base.api'

export interface InviteResponse {
  id: string
  org_id: string
  email: string
  role: string
  status: string
  expires_at: string
}

export interface PendingInviteItem {
  id: string
  org_id: string
  org_name: string
  invited_by_name: string
  invited_by_email: string
  role: string
  created_at: string
  expires_at: string
}

class InvitationApi extends BaseApiService {
  constructor() {
    super('/invitations')
  }

  /**
   * Invite a user to the currently selected org.
   * Requires x-luua-org-id header (set by interceptor).
   */
  async invite(data: { email: string; role?: 'admin' | 'member' }) {
    return this.post<InviteResponse>(data, '/invite')
  }

  /**
   * List all pending invitations for the current user (incoming).
   */
  async getPendingInvites() {
    return this.get<{ invitations: PendingInviteItem[] }>('/pending')
  }

  /**
   * Accept a pending invitation to join an org.
   */
  async acceptInvite(orgId: string) {
    return this.post<{ org_id: string; role: string }>(
      { org_id: orgId },
      '/accept'
    )
  }
}

export const invitationApi = new InvitationApi()

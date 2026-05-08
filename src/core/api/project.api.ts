import {
  type Member,
  type Project,
  type ProjectDetail,
} from '../models/org.model'
import { BaseApiService } from './base.api'

class ProjectApi extends BaseApiService {
  constructor() {
    super('/projects')
  }

  /**
   * Create a new project in the currently selected org.
   * Requires x-luua-org-id header (set by interceptor).
   */
  async createProject(data: { name: string }) {
    return this.post<Project>(data)
  }

  /**
   * Get project details for the currently selected project.
   */
  async getProjectDetails() {
    return this.get<ProjectDetail>('/current')
  }

  /**
   * Update project details (e.g. rename).
   */
  async updateProject(data: { name?: string }) {
    return this.patch<Project>(data, '/current')
  }

  /**
   * Get members of the currently selected project.
   */
  async getProjectMembers() {
    return this.get<Member[]>('/current/members')
  }

  /**
   * Remove a member from the currently selected project.
   */
  async removeProjectMember(userId: string) {
    return this.post<void>(
      { user_id: userId, action: 'remove' },
      '/current/manage-members'
    )
  }

  /**
   * Add a member to the currently selected project.
   */
  async addProjectMember(
    userId: string,
    role: 'project_admin' | 'editor' | 'viewer' = 'project_admin'
  ) {
    return this.post<void>(
      { user_id: userId, action: 'add', role },
      '/current/manage-members'
    )
  }

  /**
   * Change the role of a member in the currently selected project.
   */
  async changeProjectMemberRole(
    userId: string,
    role: 'project_admin' | 'editor' | 'viewer'
  ) {
    return this.patch<void>({ user_id: userId, role }, '/current/members/role')
  }
}

export const projectApi = new ProjectApi()

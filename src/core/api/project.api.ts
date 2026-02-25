import { Member, Project, ProjectDetail } from '../models/org.model'
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
}

export const projectApi = new ProjectApi()

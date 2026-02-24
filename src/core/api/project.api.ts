import { Project } from '../models/org.model'
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
    return this.post<Project>(data, '/')
  }
}

export const projectApi = new ProjectApi()

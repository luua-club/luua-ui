import { AutopilotSettings } from '../models/autopilot.model'
import { BaseApiService } from './base.api'

class AutopilotApi extends BaseApiService {
  constructor() {
    super('/autopilot')
  }

  async getAutoPilotSettings() {
    return this.get<AutopilotSettings>()
  }

  async updateAutoPilotSettings(settings: Partial<AutopilotSettings>) {
    return this.post<AutopilotSettings>(settings)
  }
}

export const autopilotApi = new AutopilotApi()

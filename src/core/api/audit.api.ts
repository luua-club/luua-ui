import { AuditLogsResponse } from '../models/audit-log.model'
import { BaseApiService } from './base.api'

interface GetAuditLogsParams {
  /** Single event; takes precedence over `event_types`. */
  event_type?: string
  /** OR filter; sent as comma-separated `event_types` query param. */
  event_types?: string[]
  limit: number
  offset: number
}

class AuditApi extends BaseApiService {
  constructor() {
    super('/audit-logs')
  }

  /**
   * Fetch audit log entries for the current org/project.
   */
  async getAuditLogs(params: GetAuditLogsParams) {
    const query: Record<string, string | number | string[]> = {
      limit: params.limit,
      offset: params.offset,
    }
    if (params.event_type) {
      query.event_type = params.event_type
    } else if (params.event_types?.length) {
      // Repeat `event_types` for FastAPI list[Query]; avoid axios `event_types[]=` default.
      query.event_types = params.event_types
    }
    return this.get<AuditLogsResponse>('', {
      params: query,
      paramsSerializer: { indexes: null },
    })
  }
}

export const auditApi = new AuditApi()

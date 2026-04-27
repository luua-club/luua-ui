import { AuditLogsResponse } from '../models/audit-log.model'
import { BaseApiService } from './base.api'

interface GetAuditLogsParams {
  /** OR filter; repeat `event_types` or comma-separated values per FastAPI list query. */
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
    if (params.event_types?.length) {
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

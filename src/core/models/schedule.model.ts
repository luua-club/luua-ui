export interface IScheduleDraftRequest {
  draft_id: string
  schedules: {
    [key: string]: string
  }
}

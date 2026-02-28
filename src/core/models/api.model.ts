export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

export interface ApiError {
  message: string
  status: number
  detail?:
    | string
    | {
        error: string
        error_code: string
      }
}

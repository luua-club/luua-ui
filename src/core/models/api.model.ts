export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

export interface ApiError {
  message: string
  status: number
  detail?: {
    error: string
    error_code: string
  }
}

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { toast } from 'sonner'

import { API_CONSTANTS, BASE_API_URL } from '../config/constant'
import { authInterceptor } from '../interceptors/auth.interceptor'
import { type ApiError, type ApiResponse } from '../models/api.model'
import { logout } from '../utils/common.util'

export class BaseApiService {
  protected api: AxiosInstance

  constructor(endpoint: string, config?: AxiosRequestConfig, baseURL?: string) {
    const url = baseURL || BASE_API_URL

    this.api = axios.create({
      baseURL: `${url}${endpoint}`,
      timeout: 60000,
      // Send the httpOnly auth cookie with every request (cookie-based auth).
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    })

    this.setInterceptors()
  }

  /**
   * URL helper to reduce redundancy.
   *
   * @param url - The URL to get. If not provided, returns an empty string.
   * @returns The URL or an empty string.
   */
  private getUrl(url?: string): string {
    return url || ''
  }

  /**
   * Sends a GET request to the specified URL.
   *
   * @typeParam T - The expected response data type.
   * @param url - Optional URL to override the default endpoint.
   * @param config - Optional Axios request configuration.
   * @returns A promise resolving to an ApiResponse containing the response data.
   * @throws ApiError if the request fails.
   */
  protected async get<T>(
    url?: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.api.get<T>(
        this.getUrl(url),
        config
      )
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }

  /**
   * Sends a POST request to the specified URL with the provided data.
   *
   * @typeParam T - The expected response data type.
   * @typeParam D - The type of the data being sent in the request body.
   * @param data - The data to send in the request body.
   * @param url - Optional URL to override the default endpoint.
   * @param config - Optional Axios request configuration.
   * @returns A promise resolving to an ApiResponse containing the response data.
   * @throws ApiError if the request fails.
   */
  protected async post<T, D = unknown>(
    data: D,
    url?: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.api.post<T>(
        this.getUrl(url),
        data,
        config
      )
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }

  /**
   * Sends a PUT request to the specified URL with the provided data.
   *
   * @typeParam T - The expected response data type.
   * @typeParam D - The type of the data being sent in the request body.
   * @param data - The data to send in the request body.
   * @param url - Optional URL to override the default endpoint.
   * @param config - Optional Axios request configuration.
   * @returns A promise resolving to an ApiResponse containing the response data.
   * @throws ApiError if the request fails.
   */
  protected async put<T, D = unknown>(
    data: D,
    url?: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.api.put<T>(
        this.getUrl(url),
        data,
        config
      )
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }

  /**
   * Sends a PATCH request to the specified URL with the provided data.
   *
   * @typeParam T - The expected response data type.
   * @typeParam D - The type of the data being sent in the request body.
   * @param data - The data to send in the request body.
   * @param url - Optional URL to override the default endpoint.
   * @param config - Optional Axios request configuration.
   * @returns A promise resolving to an ApiResponse containing the response data.
   * @throws ApiError if the request fails.
   */
  protected async patch<T, D = unknown>(
    data: D,
    url?: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.api.patch<T>(
        this.getUrl(url),
        data,
        config
      )
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }

  /**
   * Sends a DELETE request to the specified URL.
   *
   * @typeParam T - The expected response data type.
   * @param url - Optional URL to override the default endpoint.
   * @param config - Optional Axios request configuration.
   * @returns A promise resolving to an ApiResponse containing the response data.
   * @throws ApiError if the request fails.
   */
  protected async delete<T>(
    url?: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.api.delete<T>(
        this.getUrl(url),
        config
      )
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }

  /**
   * Handles the Axios response and formats it as an ApiResponse.
   *
   * @typeParam T - The expected response data type.
   * @param response - The Axios response object.
   * @returns An ApiResponse containing the response data, status, and message.
   */
  private handleResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
      message: response.statusText,
    }
  }

  /**
   * Handles Axios errors and formats them as an ApiError.
   *
   * @param error - The AxiosError object.
   * @returns An ApiError containing the error message, status, and optional code/detail.
   */
  private handleError(error: AxiosError): ApiError {
    const status = error.response?.status

    const apiError: ApiError = {
      message: error.message || 'An unexpected error occurred',
      status: status || 500,
    }

    if (error.response?.data) {
      const errorData = error.response.data as Record<string, unknown>

      if (errorData.detail) {
        apiError.detail = errorData.detail as ApiError['detail']
      }
    }

    /**
     * Auto-logout on 401 (unauthorized)
     */
    if (status === API_CONSTANTS.statusCode.unauthorized) {
      logout()
    }

    if (
      status === API_CONSTANTS.statusCode.conflict &&
      this.getErrorCode(apiError) !==
        API_CONSTANTS.errorCode.activeSubscriptionFound
    ) {
      toast.error(
        this.getErrorMessage(
          apiError,
          'Draft has been modified by another user. Please reload.'
        )
      )
    }

    if (status === API_CONSTANTS.statusCode.forbidden) {
      toast.error(
        this.getErrorMessage(
          apiError,
          'You Have Reached Your Current Plan Limit'
        )
      )
    }

    return apiError
  }

  private getErrorMessage(apiError: ApiError, defaultMessage: string): string {
    if (typeof apiError.detail === 'string') return apiError.detail
    if (typeof apiError.detail === 'object' && apiError.detail?.error)
      return apiError.detail.error
    return defaultMessage
  }

  private getErrorCode(apiError: ApiError): string | undefined {
    if (typeof apiError.detail === 'object') return apiError.detail?.error_code
    return undefined
  }

  /**
   * Sets up Axios interceptors.
   */
  private setInterceptors() {
    // REQUEST INTERCEPTORS
    this.api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      return authInterceptor(config) as InternalAxiosRequestConfig
    })
  }
}

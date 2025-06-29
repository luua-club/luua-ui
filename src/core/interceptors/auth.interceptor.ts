import { AxiosRequestConfig } from 'axios'

import { capitalize } from '@/shared/utils'

import { LUUA_USER_KEY } from '../config/constant'
import { getLocalStorageItem } from '../config/utils/localstorage.util'
import { ILoginResponse } from '../models/auth.model'

/**
 * Interceptor to add the JWT token to the request headers
 *
 * @param config - The request config
 * @returns The request config with the JWT token
 */
export const authInterceptor = (config: AxiosRequestConfig) => {
  const token = getLocalStorageItem<ILoginResponse>(LUUA_USER_KEY)

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `${capitalize(token.token_type)} ${token.access_token}`,
    }
  }

  return config
}

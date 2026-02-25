import { AxiosRequestConfig } from 'axios'

import { capitalize } from '@/shared/utils'

import { getLocalStorageItem } from '../../shared/utils/localstorage.util'
import {
  LUUA_SELECTED_ORG_KEY,
  LUUA_SELECTED_PROJECT_KEY,
  LUUA_USER_KEY,
} from '../config/constant'
import { LoginResponse } from '../models/auth.model'

/**
 * Interceptor to add the JWT token and org/project headers to the request
 *
 * @param config - The request config
 * @returns The request config with auth headers
 */
export const authInterceptor = (config: AxiosRequestConfig) => {
  const token = getLocalStorageItem<LoginResponse>(LUUA_USER_KEY)

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `${capitalize(token.token_type)} ${token.access_token}`,
    }
  }

  // Add org/project headers (skip for profile endpoint)
  const isProfileRequest = config.url?.includes('/profile')
  if (!isProfileRequest) {
    const orgId = getLocalStorageItem<string>(LUUA_SELECTED_ORG_KEY)
    const projectId = getLocalStorageItem<string>(LUUA_SELECTED_PROJECT_KEY)

    if (orgId) {
      config.headers = {
        ...config.headers,
        'x-luua-org-id': orgId,
      }
    }

    if (projectId) {
      config.headers = {
        ...config.headers,
        'x-luua-project-id': projectId,
      }
    }
  }

  return config
}

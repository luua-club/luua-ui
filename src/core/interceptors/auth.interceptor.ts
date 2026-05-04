import { AxiosRequestConfig } from 'axios'

import { capitalize } from '@/shared/utils'

import { getLocalStorageItem } from '../../shared/utils/localstorage.util'
import { LUUA_AUTH_INFO_KEY } from '../config/constant'
import { type AuthInfo } from '../models/auth.model'

/**
 * Interceptor to add the JWT token and org/project headers to the request
 *
 * @param config - The request config
 * @returns The request config with auth headers
 */
export const authInterceptor = (config: AxiosRequestConfig) => {
  const authInfo = getLocalStorageItem<AuthInfo>(LUUA_AUTH_INFO_KEY)

  if (authInfo?.access_token) {
    config.headers = {
      ...config.headers,
      Authorization: `${capitalize(authInfo.token_type)} ${authInfo.access_token}`,
    }
  }

  // Add org/project headers (skip for profile endpoint)
  const isProfileRequest = config.url?.includes('/profile')
  if (!isProfileRequest) {
    const orgId = authInfo?.currentOrg?.id
    const projectId = authInfo?.currentProject?.id

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

import { AxiosRequestConfig } from 'axios'

import { getLocalStorageItem } from '../../shared/utils/localstorage.util'
import { LUUA_AUTH_INFO_KEY } from '../config/constant'
import { type AuthInfo } from '../models/auth.model'

/**
 * Interceptor to add the org/project headers to the request.
 *
 * Authentication itself is handled by the httpOnly auth cookie (sent
 * automatically via `withCredentials`), so no Authorization header is added.
 *
 * @param config - The request config
 * @returns The request config with org/project headers
 */
export const authInterceptor = (config: AxiosRequestConfig) => {
  const authInfo = getLocalStorageItem<AuthInfo>(LUUA_AUTH_INFO_KEY)

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

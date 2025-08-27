import { QueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

import { API_CONSTANTS, QUERY_CONSTANTS } from './constant'

/**
 * Global Query client for tanstack query
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_CONSTANTS.staleTime,
      gcTime: QUERY_CONSTANTS.gcTime,
      retry: (failureCount, error) => {
        // Don't retry on authentication errors at all
        if (isAxiosError(error)) {
          if (
            error.response?.status === API_CONSTANTS.statusCode.unauthorized ||
            error.response?.status === API_CONSTANTS.statusCode.forbidden
          ) {
            return false
          }
        }

        // Retry upto 3 times
        if (failureCount < 2) {
          return true
        }

        return false
      },
      refetchOnWindowFocus: false,
    },
  },
})

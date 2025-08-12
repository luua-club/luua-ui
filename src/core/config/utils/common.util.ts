import { removeLocalStorageItem } from '../../../shared/utils/localstorage.util'
import { LUUA_USER_KEY } from '../constant'

/**
 * Handles unauthorized requests by removing the user from local storage and redirecting to the login page
 * this redirection will also clear all state in redux store and cancel all pending requests
 */
const logout = () => {
  removeLocalStorageItem(LUUA_USER_KEY)
  window.location.href = '/login'
}

/**
 * Normalize a JS Date to 00:00 local time and return ISO string
 */
const toStartOfDayIso = (d?: Date): string | undefined => {
  if (!d) return undefined
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  return copy.toISOString()
}

export { logout, toStartOfDayIso }

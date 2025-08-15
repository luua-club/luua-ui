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
 * Normalize a calendar day to 00:00:00.000Z (UTC) and return ISO string
 */
const toStartOfDayIso = (d?: Date): string | undefined => {
  if (!d) return undefined
  const year = d.getFullYear()
  const month = d.getMonth()
  const date = d.getDate()
  // Construct a Date at UTC midnight for the same calendar day
  const utcMidnight = new Date(Date.UTC(year, month, date, 0, 0, 0, 0))
  return utcMidnight.toISOString()
}

export { logout, toStartOfDayIso }

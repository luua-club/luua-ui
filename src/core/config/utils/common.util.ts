import { LUUA_USER_KEY } from '../constant'
import { removeLocalStorageItem } from './localstorage.util'

/**
 * Handles unauthorized requests by removing the user from local storage and redirecting to the login page
 * this redirection will also clear all state in redux store and cancel all pending requests
 */
const logout = () => {
  removeLocalStorageItem(LUUA_USER_KEY)
  window.location.href = '/login'
}

export { logout }

import posthog from 'posthog-js'

import { removeLocalStorageItem } from '@/shared/utils/localstorage.util'

import { LUUA_USER_KEY } from '../config/constant'

/**
 * Handles unauthorized requests by removing the user from local storage and redirecting to the login page
 * this redirection will also clear all state in redux store and cancel all pending requests
 */
const logout = () => {
  posthog.reset()
  removeLocalStorageItem(LUUA_USER_KEY)
  window.location.href = '/login'
}

/**
 * Normalize a calendar day to 00:00:00.000Z (UTC) and return ISO string
 *
 * @example
 * toStartOfDayIso(new Date('2025-08-21T12:34:56.789Z')) // '2025-08-21T00:00:00.000Z'
 * @param d The date to normalize
 * @returns The normalized date in ISO string format
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

/**
 * Extracts the initial of a user's name
 *
 * @example
 * extractUserInitial('John Doe') // 'JD'
 * extractUserInitial('John') // 'J'
 * @param name The user's name
 * @returns The initial of the user's name
 */
const extractUserInitial = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0]?.toUpperCase())
    .join('')
}

/**
 * Removes query parameters from the current URL
 *
 * @param params The URLSearchParams object containing the query parameters
 * @param keysToRemove The array of keys to remove from the URLSearchParams object
 */
const removeQueryParams = (params: URLSearchParams, keysToRemove: string[]) => {
  keysToRemove.forEach(key => params.delete(key))
  const newSearch = params.toString()

  if (newSearch) {
    window.history.replaceState(null, '', `${location.pathname}?${newSearch}`)
  } else {
    window.history.replaceState(null, '', location.pathname)
  }
}

/**
 * Get a random integer between min and max (inclusive)
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns A random integer between min and max
 */
const getRandomInt = (min: number, max: number): number => {
  const minVal = Math.ceil(min)
  const maxVal = Math.floor(max)
  return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal
}

export {
  extractUserInitial,
  getRandomInt,
  logout,
  removeQueryParams,
  toStartOfDayIso,
}

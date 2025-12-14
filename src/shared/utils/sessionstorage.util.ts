/**
 * Get an item from session storage
 *
 * @param key - The key to get the item from
 * @returns The item from session storage
 */
const getSessionStorageItem = <T = string>(key: string): T | null => {
  const data = sessionStorage.getItem(key)
  if (!data) return null

  try {
    return JSON.parse(data) as T
  } catch {
    return data as T
  }
}

/**
 * Set an item in session storage
 *
 * @param key - The key to set the item to
 * @param value - The value to set in session storage
 */
const setSessionStorageItem = <T>(key: string, value: T) => {
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value)
  sessionStorage.setItem(key, stringValue)
}

/**
 * Remove an item from session storage
 *
 * @param key - The key to remove the item from
 */
const removeSessionStorageItem = (key?: string) => {
  if (!key) {
    sessionStorage.clear()
    return
  }

  sessionStorage.removeItem(key)
}

export {
  getSessionStorageItem,
  removeSessionStorageItem,
  setSessionStorageItem,
}

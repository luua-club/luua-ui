/**
 * Get an item from local storage
 *
 * @param key - The key to get the item from
 * @returns The item from local storage
 */
const getLocalStorageItem = <T = null>(key: string) => {
  const data = localStorage.getItem(key)
  return data ? (JSON.parse(data) as T) : null
}

/**
 * Set an item in local storage
 *
 * @param key - The key to set the item to
 * @param value - The value to set in local storage
 */
const setLocalStorageItem = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value))
}

/**
 * Remove an item from local storage
 *
 * @param key - The key to remove the item from
 */
const removeLocalStorageItem = (key?: string) => {
  if (!key) {
    localStorage.clear()
    return
  }

  localStorage.removeItem(key)
}

export { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem }

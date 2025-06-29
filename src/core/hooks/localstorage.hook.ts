import { useLocalStorage as useLocalStorageBase } from '@uidotdev/usehooks'

/**
 * Custom hook to manage local storage with a reset function.
 *
 * @param key - The key to store the value in local storage.
 * @param initialValue - The initial value to store in local storage.
 * @returns current value, setValue, resetValue
 *
 * @example
 * ```typescript
 * const { value, setValue, resetValue } = useLocalStorage<string>("key", "value")
 * ```
 */
export const useLocalStorage = <T = null>(key: string, initialValue: T) => {
  const [value, setValue] = useLocalStorageBase<T>(key, initialValue)

  /**
   * Resets the value to the initial value.
   */
  const resetValue = () => {
    setValue(initialValue)
  }

  return { value, setValue, resetValue }
}

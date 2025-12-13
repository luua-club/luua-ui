import confetti from 'canvas-confetti'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge class names using clsx and tailwind-merge
 * @param inputs - The class names to merge
 * @returns The merged class names
 * @example
 * ```ts
 * cn('text-red-500', 'bg-blue-500') // 'text-red-500 bg-blue-500'
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Capitalize the first letter of a string
 * @param str - The string to capitalize
 * @returns The capitalized string
 */
export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Extracts the domain from a URL
 * @param url The URL to extract the domain from
 * @returns The domain of the URL
 */
export const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return url
  }
}

/**
 * Show a confetti when called
 */
export const showConfetti = () => {
  const end = Date.now() + 500 // 500 ms
  const colors = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1']

  const frame = () => {
    if (Date.now() > end) return
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors: colors,
    })
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors: colors,
    })

    requestAnimationFrame(frame)
  }
  frame()
}

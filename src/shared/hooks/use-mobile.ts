import { useEffect, useState } from 'react'

import { MOBILE_BREAKPOINT } from '../config/constant'

/**
 * Custom hook to determine if the current device is mobile-sized
 *
 * @returns True if the device is mobile-sized, false otherwise
 */
export function useIsMobile() {
  // --- State ---
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  // --- Effects ---
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    mql.addEventListener('change', onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    return () => mql.removeEventListener('change', onChange)
  }, [])

  return !!isMobile
}

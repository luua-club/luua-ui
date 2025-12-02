import { useEffect, useRef, useState } from 'react'

interface UseImageLazyLoadOptions {
  rootMargin?: string
  threshold?: number
}

/**
 * Custom hook for lazy loading images using Intersection Observer
 * Provides better control than native loading="lazy"
 */
export const useImageLazyLoad = (options: UseImageLazyLoadOptions = {}) => {
  const { rootMargin = '50px', threshold = 0.01 } = options
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const currentImg = imgRef.current
    if (!currentImg) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold }
    )

    observer.observe(currentImg)

    return () => {
      observer.disconnect()
    }
  }, [rootMargin, threshold])

  return { imgRef, isInView }
}

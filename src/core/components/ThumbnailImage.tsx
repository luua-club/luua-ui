import { memo, useState } from 'react'

import { cn } from '@/shared/utils'

import { useImageLazyLoad } from '../hooks/use-image-lazy-load.hook'

interface ThumbnailImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}

/**
 * Optimized thumbnail image component with:
 * - Intersection Observer lazy loading
 * - Shimmer placeholder
 * - Fade-in animation
 * - Async decoding
 */
const ThumbnailImage = memo(
  ({ src, alt, className, width = 48, height = 48 }: ThumbnailImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const { imgRef, isInView } = useImageLazyLoad({ rootMargin: '100px' })

    return (
      <div className={cn('relative overflow-hidden rounded-md', className)}>
        {/* Shimmer placeholder - shows while loading */}
        {!isLoaded && (
          <div
            className="from-muted via-muted-foreground/10 to-muted absolute inset-0 animate-pulse bg-gradient-to-r"
            style={{
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }}
          />
        )}

        {/* Actual image - only load when in view */}
        <img
          ref={imgRef}
          src={isInView ? src : undefined}
          alt={alt}
          width={width}
          height={height}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={cn(
            'aspect-video object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
        />

        {/* Shimmer animation keyframes injected */}
        <style>{`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}</style>
      </div>
    )
  }
)

ThumbnailImage.displayName = 'ThumbnailImage'

export default ThumbnailImage

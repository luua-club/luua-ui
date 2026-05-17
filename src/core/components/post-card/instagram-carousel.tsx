import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/shared/ui/button'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/shared/ui/carousel'

interface InstagramCarouselProps {
  images: string[]
  onRemove?: (index: number) => void
}

export function InstagramCarousel({
  images,
  onRemove,
}: InstagramCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap())
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }

    onSelect()
    api.on('select', onSelect)
    api.on('reInit', onSelect)

    return () => {
      api.off('select', onSelect)
      api.off('reInit', onSelect)
    }
  }, [api])

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api])
  const scrollNext = useCallback(() => api?.scrollNext(), [api])

  if (images.length === 0) return null

  // Single image — no carousel controls
  if (images.length === 1) {
    return (
      <div className="group bg-muted relative overflow-hidden">
        <img
          src={images[0]}
          alt="attachment-0"
          className="aspect-square w-full object-cover"
          loading="eager"
          decoding="async"
        />
        {onRemove && (
          <div className="absolute top-2 left-2 z-30 md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
            <RemoveButton index={0} onRemove={onRemove} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="group relative">
      <Carousel setApi={setApi} opts={{ align: 'start', loop: false }}>
        <CarouselContent className="ml-0">
          {images.map((src, idx) => (
            <CarouselItem key={idx} className="pl-0">
              <div className="bg-muted relative aspect-square w-full overflow-hidden">
                <img
                  src={src}
                  alt={`attachment-${idx}`}
                  className="h-full w-full object-cover"
                  loading={idx <= 1 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Remove button for current image (top-left to avoid counter badge) */}
      {onRemove && (
        <div className="absolute top-2 left-2 z-30 md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
          <RemoveButton index={currentIndex} onRemove={onRemove} />
        </div>
      )}

      {/* Left arrow */}
      {canScrollPrev && (
        <button
          type="button"
          onClick={scrollPrev}
          className="absolute top-1/2 left-2 z-20 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-sm transition-opacity hover:bg-white dark:bg-black/70 dark:hover:bg-black/90"
        >
          <ChevronLeft className="size-4 text-black dark:text-white" />
        </button>
      )}

      {/* Right arrow */}
      {canScrollNext && (
        <button
          type="button"
          onClick={scrollNext}
          className="absolute top-1/2 right-2 z-20 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-sm transition-opacity hover:bg-white dark:bg-black/70 dark:hover:bg-black/90"
        >
          <ChevronRight className="size-4 text-black dark:text-white" />
        </button>
      )}

      {/* Counter badge (top-right) */}
      <span className="absolute top-3 right-3 z-20 rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-medium text-white">
        {currentIndex + 1}/{images.length}
      </span>
    </div>
  )
}

function RemoveButton({
  index,
  onRemove,
}: {
  index: number
  onRemove: (index: number) => void
}) {
  return (
    <Button
      size="icon"
      aria-label="Remove image"
      onClick={e => {
        e.stopPropagation()
        onRemove(index)
      }}
      className="size-7 rounded-full"
    >
      <X className="size-3.5" />
    </Button>
  )
}

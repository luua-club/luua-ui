import { ArrowLeft, ArrowRight, X } from 'lucide-react'

import type { FeatureSlide } from '@/auth/config/feature-slide.config'
import { Button } from '@/shared/ui/button'
import { Highlighter } from '@/shared/ui/highlighter'
import { cn } from '@/shared/utils'

const TEXT_BAND = 'h-[clamp(11rem,22vh,15rem)]'

type FeatureSlideLayerProps = {
  slide: FeatureSlide
  slideIndex: number
  active: boolean
  theme: string
  reduce: boolean
  fullLoaded: boolean
  onFullImageLoad: () => void
}

export function FeatureSlideLayer({
  slide,
  slideIndex,
  active,
  theme,
  reduce,
  fullLoaded,
  onFullImageLoad,
}: FeatureSlideLayerProps) {
  const isDark = theme === 'dark'
  const placeholderSrc = isDark ? slide.placeholderDark : slide.placeholderLight
  const fullSrc = isDark ? slide.imageDark : slide.imageLight

  const placeholderOpacity = reduce
    ? fullLoaded
      ? 'opacity-0'
      : 'opacity-100'
    : undefined

  const fullImageClasses = reduce
    ? active && fullLoaded
      ? 'opacity-100'
      : 'opacity-0'
    : undefined

  const textBandOpacity = reduce
    ? active
      ? 'opacity-100'
      : 'opacity-0'
    : undefined

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-hidden={!active}
      className={cn(
        'absolute inset-0 flex h-full min-h-0 flex-col',
        active ? 'pointer-events-auto' : 'pointer-events-none'
      )}
    >
      <div className="min-h-0 flex-1">
        <div className="relative ml-15 h-full overflow-hidden">
          {/* Blurred tiny image fills the frame immediately while the full asset loads */}
          <img
            src={placeholderSrc}
            alt=""
            aria-hidden
            decoding="async"
            key={`${slide.id}-ph-${theme}`}
            className={cn(
              'absolute inset-0 h-full w-full object-cover object-top-left',
              'scale-[1.04] blur-2xl',
              reduce
                ? placeholderOpacity
                : cn(
                    'transition-opacity duration-500 ease-out',
                    fullLoaded ? 'opacity-0' : 'opacity-100'
                  )
            )}
          />
          <img
            src={fullSrc}
            alt={slide.alt}
            decoding="async"
            loading="eager"
            fetchPriority={slideIndex === 0 ? 'high' : undefined}
            onLoad={onFullImageLoad}
            key={`${slide.id}-full-${theme}`}
            className={cn(
              'absolute inset-0 h-full w-full object-cover object-top-left',
              'will-change-[opacity,filter,transform]',
              reduce
                ? fullImageClasses
                : cn(
                    'transition-[opacity,filter,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                    active && fullLoaded
                      ? 'blur-0 scale-100 opacity-100'
                      : 'scale-[1.015] opacity-0 blur-[8px]'
                  )
            )}
          />
        </div>
      </div>

      <div className={cn('shrink-0', TEXT_BAND)}>
        <div
          className={cn(
            'relative flex h-full min-h-0 w-full flex-col justify-center',
            'border-t px-8 py-2 pl-14 text-end',
            reduce
              ? textBandOpacity
              : cn(
                  'transition-opacity duration-500 ease-out',
                  active ? 'opacity-100' : 'opacity-0'
                )
          )}
        >
          <div className="absolute top-0 left-8 -translate-x-1/2 -translate-y-1/2">
            <X className="text-border size-8" strokeWidth={1} />
          </div>

          <FeatureSlideText slide={slide} active={active} isDark={isDark} />
        </div>
      </div>
    </div>
  )
}

type FeatureSlideTextProps = {
  slide: FeatureSlide
  active: boolean
  isDark: boolean
}

function FeatureSlideText({ slide, active, isDark }: FeatureSlideTextProps) {
  const highlightColor = isDark ? slide.highlightDark : slide.highlightLight

  return (
    <>
      <h2 className="text-foreground mb-4 text-3xl font-semibold text-balance">
        <Highlighter
          action="highlight"
          enabled={active}
          color={highlightColor}
          strokeWidth={1}
        >
          {slide.highlight}
        </Highlighter>{' '}
        <br /> <span className="font-medium italic">{slide.italic}</span>
      </h2>
      <p className="text-foreground/80 text-balance">{slide.body}</p>
    </>
  )
}

type FeatureSlideControlsProps = {
  slides: readonly FeatureSlide[]
  activeIndex: number
  theme: string
  reduce: boolean
  onPrev: () => void
  onNext: () => void
  onGoTo: (index: number) => void
}

export function FeatureSlideControls({
  slides,
  activeIndex,
  theme,
  reduce,
  onPrev,
  onNext,
  onGoTo,
}: FeatureSlideControlsProps) {
  const isDark = theme === 'dark'

  return (
    <section
      className={cn(
        'border-border flex shrink-0 flex-row items-center justify-end gap-2 border-t',
        'h-[clamp(3.5rem,7vh,5rem)] px-8 pl-14'
      )}
    >
      <Button
        variant="outline"
        size="icon"
        className="size-8 shrink-0 rounded-md shadow-md"
        onClick={onPrev}
        aria-label="Previous slide"
      >
        <ArrowLeft />
      </Button>
      <div className="flex items-center gap-1.5 px-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onGoTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              'h-1 rounded-sm',
              reduce ? '' : 'transition-all',
              activeIndex === i
                ? isDark
                  ? 'w-4 bg-white/85'
                  : 'w-4 bg-black/80'
                : 'bg-border w-1.5'
            )}
          />
        ))}
      </div>
      <Button
        variant="outline"
        size="icon"
        className="size-8 shrink-0 rounded shadow-md"
        onClick={onNext}
        aria-label="Next slide"
      >
        <ArrowRight />
      </Button>
    </section>
  )
}

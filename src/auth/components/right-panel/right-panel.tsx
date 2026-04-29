import { useCallback, useEffect, useRef, useState } from 'react'

import {
  FEATURE_CAROUSEL_AUTOPLAY_MS,
  FEATURE_SLIDES,
} from '@/auth/config/feature-slide.config'

import { wrapSlideIndex } from '../../utils/feature-slide.util'
import { RightPanelDecorations } from './right-panel-decorations'
import { FeatureSlideControls, FeatureSlideLayer } from './right-panel-features'

const SLIDE_COUNT = FEATURE_SLIDES.length

interface RightPanelProps {
  theme: string
}

function RightPanel({ theme }: RightPanelProps) {
  // ---- State ----
  const [index, setIndex] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [loadedKeys, setLoadedKeys] = useState<Set<string>>(() => new Set())

  // ---- Refs ----
  /** True while pointer is inside the carousel or it has focus — pauses autoplay */
  const pausedRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ---- Derived ----
  const setPaused = useCallback((paused: boolean) => {
    pausedRef.current = paused
  }, [])

  const markImageLoaded = useCallback(
    (slideId: string, currentTheme: string) => {
      const key = `${slideId}:${currentTheme}`
      setLoadedKeys(prev => (prev.has(key) ? prev : new Set(prev).add(key)))
    },
    []
  )

  const startAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (reduceMotion) return

    timerRef.current = setInterval(() => {
      // Skip when tab is hidden or user hovered/focused — saves work and feels less noisy
      if (pausedRef.current || document.hidden) return
      setIndex(i => (i + 1) % SLIDE_COUNT)
    }, FEATURE_CAROUSEL_AUTOPLAY_MS)
  }, [reduceMotion])

  // ---- Effects ----
  /**
   * Respect prefers-reduced-motion: skip timed transitions and use instant opacity swaps.
   */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    startAutoplay()
    const onVisibility = () => {
      // Restart interval when returning to the tab so timing stays predictable
      if (!document.hidden) startAutoplay()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [startAutoplay])

  // ---- Navigation ----
  const goTo = useCallback(
    (i: number) => {
      setIndex(wrapSlideIndex(i, SLIDE_COUNT))
      startAutoplay()
    },
    [startAutoplay]
  )

  const goNext = useCallback(() => goTo(index + 1), [goTo, index])
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index])

  // ---- Handlers ----
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goPrev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      goNext()
    }
  }

  return (
    <div className="relative hidden h-full w-1/2 lg:block">
      <RightPanelDecorations />

      <div
        className="relative flex h-full flex-col"
        role="region"
        aria-roledescription="carousel"
        aria-label="Feature highlights"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <section className="h-[clamp(4rem,12vh,8rem)] shrink-0 border-b" />

        <div className="relative min-h-0 flex-1">
          {FEATURE_SLIDES.map((slide, i) => {
            const active = i === index
            const loadKey = `${slide.id}:${theme}`
            const fullLoaded = loadedKeys.has(loadKey)

            return (
              <FeatureSlideLayer
                key={slide.id}
                slide={slide}
                slideIndex={i}
                active={active}
                theme={theme}
                reduce={reduceMotion}
                fullLoaded={fullLoaded}
                onFullImageLoad={() => markImageLoaded(slide.id, theme)}
              />
            )
          })}
        </div>

        <FeatureSlideControls
          slides={FEATURE_SLIDES}
          activeIndex={index}
          theme={theme}
          reduce={reduceMotion}
          onPrev={goPrev}
          onNext={goNext}
          onGoTo={goTo}
        />
      </div>
    </div>
  )
}

export default RightPanel

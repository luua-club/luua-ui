import { useInView } from 'motion/react'
import type React from 'react'
import { useEffect, useRef } from 'react'
import { annotate } from 'rough-notation'
import { type RoughAnnotation } from 'rough-notation/lib/model'

type AnnotationAction =
  | 'highlight'
  | 'underline'
  | 'box'
  | 'circle'
  | 'strike-through'
  | 'crossed-off'
  | 'bracket'

interface HighlighterProps {
  children: React.ReactNode
  action?: AnnotationAction
  color?: string
  strokeWidth?: number
  animationDuration?: number
  iterations?: number
  padding?: number
  multiline?: boolean
  isView?: boolean
  /** When false, no rough-notation SVG is attached (e.g. carousel slide not active). Avoids stacked colours and overflow past opacity-hidden parents. */
  enabled?: boolean
}

export function Highlighter({
  children,
  action = 'highlight',
  color = '#ffd1dc',
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = false,
  enabled = true,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null)
  const annotationRef = useRef<RoughAnnotation | null>(null)

  const isInView = useInView(elementRef, {
    once: true,
    margin: '-10%',
  })

  const shouldAnnotate = enabled && (!isView || isInView)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    annotationRef.current?.remove()
    annotationRef.current = null

    const parent = element.parentElement
    if (parent) {
      parent
        .querySelectorAll(':scope > svg.rough-annotation')
        .forEach(node => node.parentElement?.removeChild(node))
    }

    if (!shouldAnnotate) return

    const annotationConfig = {
      type: action,
      color,
      strokeWidth,
      animationDuration,
      iterations,
      padding,
      multiline,
    }

    const annotation = annotate(element, annotationConfig)

    annotationRef.current = annotation
    annotation.show()

    const resizeObserver = new ResizeObserver(() => {
      annotation.hide()
      annotation.show()
    })

    resizeObserver.observe(element)

    return () => {
      annotation.remove()
      annotationRef.current = null
      resizeObserver.disconnect()
      if (parent) {
        parent
          .querySelectorAll(':scope > svg.rough-annotation')
          .forEach(node => node.parentElement?.removeChild(node))
      }
    }
  }, [
    shouldAnnotate,
    action,
    color,
    strokeWidth,
    animationDuration,
    iterations,
    padding,
    multiline,
  ])

  return (
    <span ref={elementRef} className="relative inline-block bg-transparent">
      {children}
    </span>
  )
}

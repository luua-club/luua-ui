import { forwardRef, useLayoutEffect, useRef } from 'react'

import { Textarea } from '@/shared/ui/textarea'

interface AutoResizeTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export const AutoResizeTextarea = forwardRef<
  HTMLTextAreaElement,
  AutoResizeTextareaProps
>(({ value, onChange, ...props }, ref) => {
  const innerRef = useRef<HTMLTextAreaElement | null>(null)

  // merge forwarded ref + local ref
  const combinedRef = (node: HTMLTextAreaElement | null) => {
    innerRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref)
      (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
  }

  // 🔑 Run resize whenever `value` changes (AI or user)
  useLayoutEffect(() => {
    const el = innerRef.current
    if (!el) return
    el.style.height = 'auto' // reset
    el.style.height = `${el.scrollHeight}px` // set to scrollHeight
  }, [value])

  return (
    <Textarea
      {...props}
      ref={combinedRef}
      value={value}
      onChange={onChange}
      className={`resize-none overflow-hidden ${props.className ?? ''}`}
    />
  )
})

AutoResizeTextarea.displayName = 'AutoResizeTextarea'

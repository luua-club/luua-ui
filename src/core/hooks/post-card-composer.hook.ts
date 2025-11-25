import React, { useRef, useState } from 'react'

export interface UsePostCardComposer {
  // Text content
  content: string
  setContent: React.Dispatch<React.SetStateAction<string>>

  // Textarea and selection
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  updateSelectionRef: (
    e:
      | React.SyntheticEvent<HTMLTextAreaElement, Event>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => void

  // Actions
  addEmoji: (emoji: string) => void
}

export const usePostCardComposer = (): UsePostCardComposer => {
  // State
  const [content, setContent] = useState('')

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const selectionRef = useRef<{ start: number; end: number }>({
    start: 0,
    end: 0,
  })

  // --- Functions ---
  /**
   * Updates the selection ref
   *
   * @param e The event
   */
  const updateSelectionRef = (
    e:
      | React.SyntheticEvent<HTMLTextAreaElement, Event>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    const target = e.currentTarget
    selectionRef.current = {
      start: target.selectionStart ?? 0,
      end: target.selectionEnd ?? 0,
    }
  }

  /**
   * Adds an emoji to the content
   *
   * @param emoji The emoji to add
   */
  const addEmoji = (emoji: string) => {
    const current = textareaRef.current
    if (!current) {
      setContent(prev => prev + emoji)
      return
    }
    const { start, end } = selectionRef.current
    const safeStart = Math.max(0, Math.min(start, content.length))
    const safeEnd = Math.max(0, Math.min(end, content.length))
    const left = content.slice(0, safeStart)
    const right = content.slice(safeEnd)
    const next = left + emoji + right
    const caret = safeStart + emoji.length
    setContent(next)
    requestAnimationFrame(() => {
      current.focus()
      try {
        current.selectionStart = caret
        current.selectionEnd = caret
      } catch {}
    })
  }

  return {
    content,
    setContent,
    textareaRef,
    updateSelectionRef,
    addEmoji,
  }
}

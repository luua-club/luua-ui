import React, { useEffect, useMemo, useRef, useState } from 'react'

export interface UsePostComposer {
  // Text content
  content: string
  setContent: React.Dispatch<React.SetStateAction<string>>

  // TODO They will be a link: Files
  attachedFiles: File[]
  setAttachedFiles: React.Dispatch<React.SetStateAction<File[]>>
  imagePreviews: string[]

  // Textarea and selection
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  updateSelectionRef: (
    e:
      | React.SyntheticEvent<HTMLTextAreaElement, Event>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => void

  // Actions
  addEmoji: (emoji: string) => void
  onDelete: () => void
  removeImageAt: (imgIdx: number) => void
  removeAttachmentAt: (attIdx: number) => void
  resetState: () => void
}

export const usePostComposer = (): UsePostComposer => {
  //TODO: ATTACHMENTS WILL BE A LINK
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  // Content
  const [content, setContent] = useState('')

  // Textarea and selection
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const selectionRef = useRef<{ start: number; end: number }>({
    start: 0,
    end: 0,
  })

  const imageFiles = useMemo(
    () => attachedFiles.filter(f => f.type.startsWith('image/')),
    [attachedFiles]
  )

  useEffect(() => {
    const urls = imageFiles.map(f => URL.createObjectURL(f))
    setImagePreviews(urls)
    return () => {
      urls.forEach(u => URL.revokeObjectURL(u))
    }
  }, [imageFiles])

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

  const resetState = () => {
    // Clear attachments and content
    setAttachedFiles([])
    setContent('')
    // Clear any generated previews immediately
    setImagePreviews([])
    // Reset selection/caret tracking
    selectionRef.current = { start: 0, end: 0 }
    // Optionally blur and refocus to ensure clean caret state
    const el = textareaRef.current
    if (el) {
      try {
        el.blur()
      } catch {}
      requestAnimationFrame(() => {
        try {
          el.focus()
          el.selectionStart = 0
          el.selectionEnd = 0
        } catch {}
      })
    }
  }

  const onDelete = () => {
    resetState()
  }

  const removeImageAt = (imgIdx: number) => {
    setAttachedFiles(prev => {
      let imageCounter = -1
      return prev.filter(file => {
        if (file.type.startsWith('image/')) {
          imageCounter += 1
          if (imageCounter === imgIdx) return false
        }
        return true
      })
    })
  }

  const removeAttachmentAt = (attIdx: number) => {
    setAttachedFiles(prev => {
      let attachmentCounter = -1
      return prev.filter(file => {
        const isPdf =
          file.type === 'application/pdf' ||
          file.name.toLowerCase().endsWith('.pdf')
        if (isPdf) {
          attachmentCounter += 1
          if (attachmentCounter === attIdx) return false
        }
        return true
      })
    })
  }

  return {
    content,
    setContent,
    attachedFiles,
    setAttachedFiles,
    imagePreviews,
    textareaRef,
    updateSelectionRef,
    addEmoji,
    onDelete,
    removeImageAt,
    removeAttachmentAt,
    resetState,
  }
}

import { List, ListOrdered, Paperclip, SmilePlus, Sparkles } from 'lucide-react'
import type React from 'react'

import {
  applyBold,
  applyBullet,
  applyItalic,
  applyNumbered,
  applyStrikethrough,
} from '@/core/utils/text-format.util'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'

interface PostFormatToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  content: string
  setContent: (val: string) => void
  onContentChange: (val: string) => void
}

export function PostFormatToolbar({
  textareaRef,
  content,
  setContent,
  onContentChange,
}: PostFormatToolbarProps) {
  function applyFormat(transform: (text: string) => string) {
    const el = textareaRef.current
    const start = el?.selectionStart ?? 0
    const end = el?.selectionEnd ?? 0
    const hasSelection = start !== end

    let next: string
    let newStart: number
    let newEnd: number

    if (hasSelection) {
      const selected = content.slice(start, end)
      const transformed = transform(selected)
      next = content.slice(0, start) + transformed + content.slice(end)
      newStart = start
      newEnd = start + transformed.length
    } else {
      next = transform(content)
      newStart = 0
      newEnd = next.length
    }

    setContent(next)
    onContentChange(next)

    requestAnimationFrame(() => {
      if (!el) return
      el.focus()
      try {
        el.selectionStart = hasSelection ? newStart : newEnd
        el.selectionEnd = hasSelection ? newEnd : newEnd
      } catch {}
    })
  }

  return (
    <div className="bg-card mb-3 flex items-center gap-0.5 rounded-lg border px-1.5 py-1">
      {/* Text formatting */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-sm font-bold"
        onClick={() => applyFormat(applyBold)}
        title="Bold"
        type="button"
      >
        B
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-sm italic"
        onClick={() => applyFormat(applyItalic)}
        title="Italic"
        type="button"
      >
        I
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-sm line-through"
        onClick={() => applyFormat(applyStrikethrough)}
        title="Strikethrough"
        type="button"
      >
        S
      </Button>

      <Separator orientation="vertical" className="mx-1 h-4" />

      {/* List formatting */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => applyFormat(applyBullet)}
        title="Bullet list"
        type="button"
      >
        <List className="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => applyFormat(applyNumbered)}
        title="Numbered list"
        type="button"
      >
        <ListOrdered className="size-3.5" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-4" />

      {/* Tools */}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1 px-2 text-xs"
        type="button"
        disabled
      >
        <Sparkles className="size-3" />
        Enhance
      </Button>

      <div className="ml-auto flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          type="button"
          disabled
          title="Upload file"
        >
          <Paperclip className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          type="button"
          disabled
          title="Emoji"
        >
          <SmilePlus className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}

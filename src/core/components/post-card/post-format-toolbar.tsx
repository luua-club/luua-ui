import { List, ListOrdered } from 'lucide-react'
import type React from 'react'

import PostCardActions, {
  type UploadConfig,
} from '@/core/components/post-card/post-card-actions'
import {
  applyBold,
  applyBullet,
  applyItalic,
  applyNumbered,
  applyStrikethrough,
} from '@/core/utils/text-format.util'
import { AnimatedGradientText } from '@/shared/ui/animated-gradient-text'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'

interface PostFormatToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  content: string
  setContent: (val: string) => void
  onContentChange: (val: string) => void
  onEmojiSelect?: (emoji: string) => void
  onFilesUploaded?: (fileUrls: string[]) => void
  uploadConfig?: UploadConfig
}

export function PostFormatToolbar({
  textareaRef,
  content,
  setContent,
  onContentChange,
  onEmojiSelect,
  onFilesUploaded,
  uploadConfig,
}: PostFormatToolbarProps) {
  function insertEmoji(emoji: string) {
    const el = textareaRef.current
    const start = el?.selectionStart ?? content.length
    const end = el?.selectionEnd ?? content.length
    const next = content.slice(0, start) + emoji + content.slice(end)
    setContent(next)
    onContentChange(next)
    onEmojiSelect?.(emoji)
    requestAnimationFrame(() => {
      if (!el) return
      el.focus()
      try {
        el.selectionStart = start + emoji.length
        el.selectionEnd = start + emoji.length
      } catch {}
    })
  }

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
    <div className="bg-card/95 mb-2 flex items-center gap-0.5 rounded-md border">
      {/* Text formatting */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 pl-1.5 text-sm font-bold"
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
      <Separator orientation="vertical" className="mx-1 !h-8" />
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
      <Separator orientation="vertical" className="mx-1 !h-8" />

      <div className="ml-auto flex items-center gap-1">
        <Separator orientation="vertical" className="!h-8" />

        <PostCardActions
          onEmojiSelect={insertEmoji}
          onFilesUploaded={onFilesUploaded}
          uploadConfig={uploadConfig}
        />

        <Separator orientation="vertical" className="!h-8" />

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground h-7 px-2 text-xs hover:cursor-pointer"
        >
          <AnimatedGradientText className="font-medium">
            ✨ Enhance
          </AnimatedGradientText>
        </Button>
      </div>
    </div>
  )
}

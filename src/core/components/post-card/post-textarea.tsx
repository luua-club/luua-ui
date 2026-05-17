import { List, ListOrdered } from 'lucide-react'
import type React from 'react'

import PostCardActions, {
  type PostCardActionsHandle,
  type UploadConfig,
} from '@/core/components/post-card/post-card-actions'
import {
  applyBold,
  applyBullet,
  applyItalic,
  applyNumbered,
  applyStrikethrough,
} from '@/core/utils/text-format.util'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { Textarea } from '@/shared/ui/textarea'
import { cn } from '@/shared/utils'

interface PostTextareaProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  uploadActionsRef?: React.RefObject<PostCardActionsHandle | null>
  content: string
  setContent: (val: string) => void
  onContentChange: (val: string) => void
  onFilesUploaded?: (fileUrls: string[]) => void
  uploadConfig?: UploadConfig
  placeholder?: string
  maxLength?: number
  disabled?: boolean
  onSelectionUpdate?: (event: React.SyntheticEvent<HTMLTextAreaElement>) => void
  className?: string
  toolbarClassName?: string
  textareaClassName?: string
}

export function PostTextarea({
  textareaRef,
  uploadActionsRef,
  content,
  setContent,
  onContentChange,
  onFilesUploaded,
  uploadConfig,
  placeholder,
  maxLength,
  disabled,
  onSelectionUpdate,
  className,
  toolbarClassName,
  textareaClassName,
}: PostTextareaProps) {
  function insertEmoji(emoji: string) {
    const el = textareaRef.current
    const start = el?.selectionStart ?? content.length
    const end = el?.selectionEnd ?? content.length
    const next = content.slice(0, start) + emoji + content.slice(end)
    setContent(next)
    onContentChange(next)
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
    <div className={cn('flex flex-col gap-1', className)}>
      <div className={cn('flex items-center gap-0.5', toolbarClassName)}>
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
        <Separator orientation="vertical" className="mx-1 !h-5" />
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
        <Separator orientation="vertical" className="mx-1 !h-5" />

        <div className="ml-auto flex items-center gap-1">
          <PostCardActions
            ref={uploadActionsRef}
            onEmojiSelect={insertEmoji}
            onFilesUploaded={onFilesUploaded}
            uploadConfig={uploadConfig}
          />
        </div>
      </div>

      <Textarea
        className={cn(
          'resize-none text-sm',
          'caret-primary selection:bg-brand-accent-yellow border-1 border-dashed selection:text-black',
          'transition-colors duration-200',
          'focus:border-1 focus:shadow-none focus:ring-0 focus:outline-none',
          'focus-visible:border-1 focus-visible:border-dashed focus-visible:shadow-none focus-visible:ring-0',
          textareaClassName
        )}
        placeholder={placeholder}
        ref={textareaRef}
        value={content}
        maxLength={maxLength}
        onChange={e => {
          setContent(e.target.value)
          onContentChange(e.target.value)
        }}
        onSelect={onSelectionUpdate}
        onKeyUp={onSelectionUpdate}
        onClick={onSelectionUpdate}
        disabled={disabled}
      />
    </div>
  )
}

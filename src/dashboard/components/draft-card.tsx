import { formatDistanceToNow } from 'date-fns'
import { Check, EllipsisVertical, FileText, Trash2, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'

import StackedPlatformIcons from '@/core/components/stacked-platform-icons'
import { type DraftItem } from '@/core/models/draft.model'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardFooter } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { Separator } from '@/shared/ui/separator'
import { Skeleton } from '@/shared/ui/skeleton'
import { cn } from '@/shared/utils/index'

// ---------------------------------------------------------------------------
// DraftCard
// ---------------------------------------------------------------------------
interface DraftCardProps {
  draft: DraftItem
  onClick: () => void
  onRenameSave: (name: string) => void
  onDelete: () => void
  isRenamePending?: boolean
  isDeletePending?: boolean
}

export function DraftCard({
  draft,
  onClick,
  onRenameSave,
  onDelete,
  isRenamePending = false,
  isDeletePending = false,
}: DraftCardProps) {
  // ---- Preview body + channel row (from first post with text, else first post) ----
  const previewPost = draft.posts.find(p => p.content?.trim()) ?? draft.posts[0]
  const previewText = previewPost?.content ?? ''
  const channels = draft.posts.map(p => p.channel)

  return (
    <Card
      onClick={e => {
        if (e.defaultPrevented) return
        onClick()
      }}
      className={cn(
        'bg-card/70 h-44 w-full min-w-0 cursor-pointer',
        'gap-0 overflow-hidden rounded-md border p-0',
        'shadow-none transition-shadow hover:shadow-md'
      )}
    >
      <CardContent className="h-full p-3">
        {previewText ? (
          <p
            className={cn(
              'line-clamp-6 text-[10px] leading-relaxed break-words',
              'text-foreground/90'
            )}
          >
            {previewText}
          </p>
        ) : (
          <div className="flex h-full items-center justify-center">
            <FileText className="text-muted-foreground/40 size-8" />
          </div>
        )}
      </CardContent>

      <Separator />

      <CardFooter className="bg-card gap-2 px-3 py-2">
        <StackedPlatformIcons channels={channels} />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between gap-1">
            <p
              className={cn(
                'min-w-0 truncate text-xs leading-tight font-medium',
                'text-foreground'
              )}
            >
              {draft.name || 'Untitled'}
            </p>

            <DraftCardActionsPopover
              draftDisplayName={draft.name || 'Untitled'}
              onRenameSave={onRenameSave}
              onDelete={onDelete}
              isRenamePending={isRenamePending}
              isDeletePending={isDeletePending}
            />
          </div>

          <p className="text-muted-foreground text-xs leading-tight">
            {formatDistanceToNow(new Date(draft.updated_at), {
              addSuffix: true,
            })}
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// DraftCardSkeleton
// ---------------------------------------------------------------------------
export function DraftCardSkeleton() {
  return (
    <Card
      className={cn(
        'bg-card/70 h-44 w-full min-w-0 cursor-pointer',
        'gap-0 overflow-hidden rounded-md border p-0',
        'shadow-none transition-shadow hover:shadow-md'
      )}
    >
      <CardContent className="bg-muted/40 h-28 p-3">
        <Skeleton className="mb-1.5 h-3 w-full" />
        <Skeleton className="mb-1.5 h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </CardContent>
      <CardFooter className="gap-2 px-3 py-2">
        <Skeleton className="size-9 shrink-0 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-2 w-20" />
        </div>
      </CardFooter>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// DraftCardActionsPopover
// ---------------------------------------------------------------------------
interface DraftCardActionsPopoverProps {
  draftDisplayName: string
  onRenameSave: (name: string) => void
  onDelete: () => void
  isRenamePending?: boolean
  isDeletePending?: boolean
}

function DraftCardActionsPopover({
  draftDisplayName,
  onRenameSave,
  onDelete,
  isRenamePending = false,
  isDeletePending = false,
}: DraftCardActionsPopoverProps) {
  const nameFieldId = useId()
  const [open, setOpen] = useState(false)
  const [editName, setEditName] = useState(draftDisplayName)

  // ---- Reset draft title field whenever the menu opens (or server name changes while open) ----
  useEffect(() => {
    if (open) {
      setEditName(draftDisplayName || 'Untitled')
    }
  }, [open, draftDisplayName])

  const handleRenameSubmit = () => {
    onRenameSave(editName.trim() || 'Untitled')
    setOpen(false)
  }

  const handleDelete = () => {
    onDelete()
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Draft actions"
          onPointerDown={e => e.stopPropagation()}
          onMouseDown={e => e.stopPropagation()}
          onClick={e => e.stopPropagation()}
          className={cn(
            'shrink-0 cursor-pointer rounded p-1',
            'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          <EllipsisVertical className="size-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-64 overflow-hidden p-0"
        onPointerDown={e => e.stopPropagation()}
        onMouseDown={e => e.stopPropagation()}
        onClick={e => e.stopPropagation()}
      >
        {/* Title row: label + dismiss (cancel) */}
        <div className="flex items-center justify-between gap-2 border-b px-3 py-2 pr-1">
          <label
            htmlFor={nameFieldId}
            className="text-muted-foreground text-sm leading-none font-medium tracking-tight"
          >
            Edit Draft
          </label>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground size-7 shrink-0"
            aria-label="Close"
            onClick={() => setOpen(false)}
          >
            <X className="size-3.5" />
          </Button>
        </div>

        {/* Name input + save / delete */}
        <div className="space-y-4 px-3 py-3">
          <Input
            id={nameFieldId}
            value={editName}
            onChange={e => setEditName(e.target.value)}
            placeholder="Draft name"
            maxLength={120}
            className="h-8 text-sm"
            disabled={isRenamePending}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleRenameSubmit()
              }
            }}
          />

          <div className="flex gap-3">
            <Button
              type="button"
              size="sm"
              variant="default"
              className="flex-1"
              aria-label="Save draft name"
              disabled={isRenamePending}
              onClick={handleRenameSubmit}
            >
              <Check className="size-3.5" />
              Save
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="flex-1"
              aria-label="Delete draft"
              disabled={isDeletePending}
              onClick={handleDelete}
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

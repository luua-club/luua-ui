import { Calendar, Check, Loader2, Pencil, Save, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { DraftBadge } from '@/shared/components/post-state-badge'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Separator } from '@/shared/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import { cn } from '@/shared/utils'

function ActionButton({
  disabled,
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  if (!disabled) {
    return (
      <Button className={className} {...props}>
        {children}
      </Button>
    )
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex cursor-not-allowed">
          <Button
            disabled
            className={cn('pointer-events-none', className)}
            {...props}
          >
            {children}
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent className="text-balance">
        <span>
          Content cannot be empty <br /> or exceed the character limit
        </span>
      </TooltipContent>
    </Tooltip>
  )
}

type SaveStatus = 'idle' | 'pending' | 'saved'

interface CreateHeaderProps {
  title?: string
  updatedAt?: string
  canRename?: boolean
  onSave?: () => void
  saveStatus?: SaveStatus
  saveDisabled?: boolean
  onSchedule?: () => void
  scheduleDisabled?: boolean
  onPublish?: () => void
  publishDisabled?: boolean
  onTitleChange?: (title: string) => void
}

function CreateHeader({
  title = 'Untitled',
  updatedAt,
  canRename = false,
  onSave,
  saveStatus = 'idle',
  saveDisabled,
  onSchedule,
  scheduleDisabled,
  onPublish,
  publishDisabled,
  onTitleChange,
}: CreateHeaderProps) {
  // --- State ---
  const [isEditing, setIsEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(title)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync when title prop changes externally (e.g. draft loaded from API)
  useEffect(() => {
    if (!isEditing) setDraftTitle(title)
  }, [title, isEditing])

  // --- Functions ---
  function handleEditClick() {
    setDraftTitle(title)
    setIsEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  function handleCommit() {
    const trimmed = draftTitle.trim() || 'Untitled'
    setIsEditing(false)
    setDraftTitle(trimmed)
    onTitleChange?.(trimmed)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setDraftTitle(title)
      setIsEditing(false)
      return
    }
    if (e.key === 'Enter') handleCommit()
  }

  const saveLabel =
    saveStatus === 'saved'
      ? 'Saved'
      : saveStatus === 'pending'
        ? 'Saving...'
        : 'Save'

  return (
    <header className="border-border/70 bg-secondary/96 dark:bg-card/92 supports-[backdrop-filter]:bg-secondary/90 dark:supports-[backdrop-filter]:bg-card/85 flex items-center justify-between border-b px-3 py-3 backdrop-blur-sm sm:px-4">
      {/* Left: title + badge + timestamp */}
      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="flex h-6 items-center gap-2">
          {isEditing ? (
            <Input
              ref={inputRef}
              value={draftTitle}
              onChange={e => setDraftTitle(e.target.value)}
              onBlur={handleCommit}
              onKeyDown={handleKeyDown}
              className="h-6 w-56 max-w-[140px] px-1 py-0 text-sm font-semibold sm:max-w-xs"
              autoFocus
            />
          ) : (
            <>
              <span className="text-foreground max-w-[140px] truncate text-sm font-semibold tracking-tight sm:max-w-xs">
                {title}
              </span>
              {canRename && (
                <button
                  onClick={handleEditClick}
                  className="text-muted-foreground hover:text-foreground transition-colors hover:cursor-pointer"
                  aria-label="Edit draft name"
                >
                  <Pencil className="size-3" />
                </button>
              )}
            </>
          )}

          <DraftBadge />
        </div>

        {updatedAt && (
          <p className="text-muted-foreground text-xs">{updatedAt}</p>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={saveDisabled}
          className={cn(
            'min-w-[88px] justify-center disabled:opacity-60',
            saveStatus === 'saved' && 'text-green-600 dark:text-green-400'
          )}
        >
          {saveStatus === 'pending' ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : saveStatus === 'saved' ? (
            <Check className="size-3.5" />
          ) : (
            <Save className="size-3.5" />
          )}
          <span className="hidden sm:inline">{saveLabel}</span>
        </Button>

        <Separator orientation="vertical" className="!h-6" />

        <ActionButton
          variant="outline"
          size="sm"
          onClick={onSchedule}
          disabled={scheduleDisabled}
          className="dark:border-input/60 dark:bg-input/30 dark:hover:bg-input/45 border disabled:opacity-60"
        >
          <Calendar className="size-3.5" />
          <span className="hidden lg:inline">Schedule</span>
        </ActionButton>

        <ActionButton
          size="sm"
          onClick={onPublish}
          disabled={publishDisabled}
          className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          <span className="hidden lg:inline">Publish</span>
          <Send className="size-3.5" />
        </ActionButton>
      </div>
    </header>
  )
}

export default CreateHeader

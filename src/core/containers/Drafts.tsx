import { useNavigate } from '@tanstack/react-router'
import { format } from 'date-fns'
import {
  Bookmark,
  Bot,
  Calendar,
  ChevronDown,
  ExternalLink,
  FileText,
  FolderClosed,
  FolderHeart,
  MoreHorizontal,
  Pencil,
  PencilRuler,
  Send,
  Trash,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'

import BookmarkPreviewModal from '@/core/components/bookmark-preview-modal'
import Post from '@/core/components/Post'
import { DraftItem } from '@/core/models/draft.model'
import { channelType } from '@/core/models/social.model'
import ConfirmDialog from '@/shared/components/confirm-dialog'
import ErrorBanner from '@/shared/components/error-banner'
import { Button } from '@/shared/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Input } from '@/shared/ui/input'
import { Separator } from '@/shared/ui/separator'
import { Skeleton } from '@/shared/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import { cn } from '@/shared/utils'

import ListControls from '../../core/components/ListControls'
import PaginationList from '../../shared/components/pagination-list'
import { useDraftList } from '../hooks/draft-list.hook'

interface DraftsProps {
  showOnlyAutoPilot?: boolean
  inspirationId?: string
}

const Drafts = ({ showOnlyAutoPilot = false, inspirationId }: DraftsProps) => {
  // --- Bookmark preview modal state ---
  const [bookmarkModalOpen, setBookmarkModalOpen] = useState(false)
  const [bookmarkInspirationId, setBookmarkInspirationId] = useState<
    string | null
  >(null)

  // --- Hooks ---
  const {
    dateRange,
    setDateRange,
    sort,
    setSort,
    drafts,
    isLoading,
    isError,
    limit,
    offset,
    setOffset,
    total,
    confirmOpen,
    openDelete,
    openDeletePost,
    closeDelete,
    confirmDelete,
    confirmDeletePost,
    pendingDeletePost,
    deletingIds,
    isDeleting,
  } = useDraftList(showOnlyAutoPilot, inspirationId)
  const navigate = useNavigate()

  // Track which rows are CLOSED (default = open)
  const [closedIds, setClosedIds] = useState<Set<string>>(new Set())
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState<string>('')

  const allExpanded = closedIds.size === 0

  const toggleExpandAll = () => {
    if (allExpanded) {
      setClosedIds(new Set(drafts.map(d => d.id)))
    } else {
      setClosedIds(new Set())
    }
  }

  const toggleOpen = (id: string) => {
    setClosedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const startRename = (draft: DraftItem) => {
    setRenamingId(draft.id)
    setRenameValue(draft.name)
  }

  const commitRename = () => {
    if (!renamingId) return
    const trimmed = renameValue.trim()
    if (trimmed) renameDraft(renamingId, trimmed)
    setRenamingId(null)
    setRenameValue('')
  }

  const cancelRename = () => {
    setRenamingId(null)
    setRenameValue('')
  }

  if (isError) return <ErrorBanner />

  return (
    <>
      <h1 className="mx-auto max-w-5xl py-4 text-lg font-semibold">
        {showOnlyAutoPilot ? (
          <span className="flex items-center gap-2">
            <FolderHeart className="size-5" /> Generated Autopilot Drafts
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <FolderClosed className="size-5" /> Your Saved Drafts
          </span>
        )}
      </h1>

      <div
        className={cn(
          'bg-muted/40 border-t border-b p-3',
          showOnlyAutoPilot && 'rounded-md border'
        )}
      >
        <div className="mx-auto max-w-5xl">
          <ListControls
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            sort={sort}
            onSortChange={setSort}
            allDateSelectable
            allExpanded={allExpanded}
            onToggleExpandAll={toggleExpandAll}
          />
        </div>
      </div>

      <div
        className={cn(
          'mx-auto mt-4 flex max-w-5xl flex-col',
          showOnlyAutoPilot && 'p-0'
        )}
      >
        <div className="mt-4 flex flex-col gap-4">
          {/* Skeleton */}
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg border">
                <div className="flex items-center gap-3 px-4 py-3">
                  <Skeleton className="size-4 rounded" />
                  <Skeleton className="h-4 w-44 rounded" />
                  <Skeleton className="ml-2 h-4 w-24 rounded" />
                  <div className="ml-auto flex gap-1.5">
                    <Skeleton className="h-8 w-14 rounded-md" />
                    <Skeleton className="size-8 rounded-md" />
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4 p-4">
                  <Skeleton className="h-40 rounded-lg" />
                  <Skeleton className="h-40 rounded-lg" />
                </div>
              </div>
            ))}

          {/* Empty state */}
          {!isLoading && drafts.length === 0 && (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="bg-muted rounded-xl p-4">
                <FileText className="text-muted-foreground size-6" />
              </div>
              <p className="text-sm font-medium">
                {showOnlyAutoPilot
                  ? 'No generated drafts yet'
                  : 'No drafts yet'}
              </p>
              <p className="text-muted-foreground text-xs">
                {showOnlyAutoPilot
                  ? 'Your Autopilot generated drafts will appear here'
                  : 'Your saved drafts will appear here.'}
              </p>
            </div>
          )}

          {/* Draft rows */}
          {!isLoading &&
            drafts.map((draft: DraftItem, idx: number) => {
              const isOpen = !closedIds.has(draft.id)
              const isRenaming = renamingId === draft.id
              const hasLinkedIn = draft.posts.some(
                p => p.channel === 'LinkedIn'
              )
              const hasTwitter = draft.posts.some(p => p.channel === 'Twitter')
              const postCount = draft.posts.length

              const platformLabel = [
                hasLinkedIn && 'LinkedIn',
                hasTwitter && 'X / Twitter',
              ]
                .filter(Boolean)
                .join(' · ')

              return (
                <Collapsible
                  key={draft.id}
                  open={isOpen}
                  onOpenChange={() => toggleOpen(draft.id)}
                  className={cn(
                    'bg-card rounded-lg border',
                    deletingIds.has(draft.id) &&
                      'pointer-events-none opacity-40'
                  )}
                >
                  {/* Autopilot banner */}
                  {draft.autopilot && (
                    <button
                      onClick={() => navigate({ to: '/bookmarks' })}
                      className="flex w-full items-center gap-1.5 rounded-t-lg border-b bg-violet-50 px-4 py-1.5 text-left text-xs font-medium text-violet-700 hover:bg-violet-100 dark:bg-violet-950/30 dark:text-violet-300 dark:hover:bg-violet-950/50"
                    >
                      <Bot className="size-3" />
                      <span>By Autopilot</span>
                      <span className="text-violet-400 dark:text-violet-500">
                        ·
                      </span>
                      <span className="text-violet-500 underline-offset-2 hover:underline dark:text-violet-400">
                        View bookmarks
                      </span>
                      <ExternalLink className="ml-auto size-3 text-violet-400" />
                    </button>
                  )}

                  {/* Header */}
                  <div className="flex items-center gap-2 px-4 py-2.5">
                    {/* Left: expand trigger + pencil rename */}
                    {isRenaming ? (
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <ChevronDown
                          className={cn(
                            'text-muted-foreground size-4 shrink-0 transition-transform duration-200',
                            !isOpen && '-rotate-90'
                          )}
                        />
                        <Input
                          autoFocus
                          value={renameValue}
                          className="h-7 max-w-64 text-sm"
                          onChange={e => setRenameValue(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') commitRename()
                            if (e.key === 'Escape') cancelRename()
                          }}
                          onBlur={commitRename}
                        />
                      </div>
                    ) : (
                      <div className="flex min-w-0 flex-1 items-center gap-1">
                        <CollapsibleTrigger asChild>
                          <button className="hover:bg-muted/60 -mx-1 flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-md px-1 py-1 text-left transition-colors">
                            <ChevronDown
                              className={cn(
                                'text-muted-foreground size-4 shrink-0 transition-transform duration-200',
                                !isOpen && '-rotate-90'
                              )}
                            />
                            <span
                              className={cn(
                                'truncate text-sm font-medium',
                                !draft.name?.trim() &&
                                  'text-muted-foreground italic'
                              )}
                            >
                              {draft.name?.trim() || 'Untitled'}
                            </span>
                            {platformLabel && (
                              <span className="text-muted-foreground ml-1 shrink-0 text-xs">
                                {platformLabel}
                              </span>
                            )}
                          </button>
                        </CollapsibleTrigger>

                        {/* Pencil rename — outside trigger so it doesn't toggle expand */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 shrink-0"
                              onClick={() => startRename(draft)}
                            >
                              <Pencil className="size-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Rename</TooltipContent>
                        </Tooltip>
                      </div>
                    )}

                    {/* Divider */}
                    <div className="bg-border mx-1 h-4 w-px shrink-0" />

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 gap-1.5 px-3 text-xs"
                        onClick={() =>
                          navigate({
                            to: `/creation/create`,
                            search: { draftId: draft.id },
                          })
                        }
                      >
                        <PencilRuler className="size-3.5" />
                        Edit
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground size-8"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              navigate({
                                to: '/review/$draftId',
                                params: { draftId: draft.id },
                              })
                            }
                          >
                            <Send className="size-4" />
                            Publish
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              navigate({
                                to: '/review/$draftId',
                                params: { draftId: draft.id },
                                search: { schedule: 'true' },
                              })
                            }
                          >
                            <Calendar className="size-4" />
                            Schedule
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Expanded content */}
                  <CollapsibleContent className="bg-muted/40">
                    <Separator />
                    <div
                      className={cn(
                        'grid grid-cols-1 gap-4 p-4',
                        draft.posts.length > 1 && 'lg:grid-cols-2'
                      )}
                    >
                      {getPost(
                        `${draft.id}-${idx}`,
                        'LinkedIn',
                        draft,
                        postId => openDeletePost(draft.id, postId)
                      )}
                      {getPost(
                        `${draft.id}-${idx + 1}`,
                        'Twitter',
                        draft,
                        postId => openDeletePost(draft.id, postId)
                      )}
                    </div>

                    {/* Footer */}
                    <Separator />
                    <div className="bg-card flex items-center justify-between rounded-xl px-4 py-2">
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <span title={new Date(draft.updated_at).toString()}>
                          {format(new Date(draft.updated_at), 'MMM d, h:mm a')}
                        </span>
                        <span className="text-muted-foreground/40">·</span>
                        <span>
                          {postCount} {postCount === 1 ? 'post' : 'posts'}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive bg-destructive/10 hover:bg-destructive/15 h-7 gap-1.5 px-2 text-xs"
                        onClick={() => openDelete(draft.id)}
                      >
                        <Trash className="size-3.5" />
                        Delete
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )
            })}
        </div>

        {/* Pagination */}
        {!isLoading && drafts.length > 0 && total > limit && (
          <div className="mt-8 mb-8">
            <PaginationList
              limit={limit}
              offset={offset}
              total={total}
              onOffsetChange={setOffset}
            />
          </div>
        )}

        {/* Confirm dialog */}
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={open => (open ? undefined : closeDelete())}
          title={pendingDeletePost ? 'Delete post?' : 'Delete draft?'}
          description={
            pendingDeletePost
              ? 'This action cannot be undone. This will permanently delete the selected post from the draft.'
              : 'This action cannot be undone. This will permanently delete the selected draft.'
          }
          confirmLabel="Delete"
          confirmDisabled={isDeleting}
          onConfirm={() => {
            if (pendingDeletePost) {
              confirmDeletePost()
            } else {
              confirmDelete()
            }
            closeDelete()
          }}
        />
      </div>
    </>
  )
}

const getPost = (
  id: string,
  channel: channelType,
  draftItem: DraftItem,
  onDelete: (postId: string) => void
) => {
  const item = draftItem.posts.find(post => post.channel === channel)
  if (!item) return

  return (
    <div className="relative" key={item.id}>
      {draftItem.posts.length > 1 && (
        <Button
          className="text-destructive !bg-card hover:text-destructive/80 absolute -top-2 -right-2 z-10 size-6 rounded-full !p-0"
          variant="outline"
          size="icon"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="size-3" />
        </Button>
      )}
      <Post
        id={id}
        channel={item.channel}
        content={item.content}
        attached_media={item.attached_media}
        maintainFormatting
      />
    </div>
  )
}

export default Drafts

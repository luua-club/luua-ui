import { useNavigate } from '@tanstack/react-router'
import { format } from 'date-fns'
import {
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
  Plus,
  Send,
  Trash,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'

import BookmarkPreviewModal from '@/core/components/bookmark-preview-modal'
import Post from '@/core/components/Post'
import { SOCIAL_PLATFORM } from '@/core/config/constant'
import { DraftItem } from '@/core/models/draft.model'
import { channelType } from '@/core/models/social.model'
import ConfirmDialog from '@/shared/components/confirm-dialog'
import ErrorBanner from '@/shared/components/error-banner'
import { Badge } from '@/shared/ui/badge'
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
  DropdownMenuSeparator,
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
  const isInspirationView = Boolean(inspirationId)

  // Bookmark preview modal state
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
    renameDraft,
  } = useDraftList(showOnlyAutoPilot, inspirationId)
  const navigate = useNavigate()

  // Track which rows are CLOSED (default = open)
  const [closedIds, setClosedIds] = useState<Set<string>>(new Set())
  // Global collapse mode: when active, rows are closed by default across pages.
  const [collapseAllActive, setCollapseAllActive] = useState(false)
  // Per-row overrides while global collapse mode is active.
  const [openedWhileCollapsedIds, setOpenedWhileCollapsedIds] = useState<
    Set<string>
  >(new Set())
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState<string>('')

  const isDraftOpen = (draftId: string) => {
    if (collapseAllActive) {
      return openedWhileCollapsedIds.has(draftId)
    }
    return !closedIds.has(draftId)
  }

  const allExpanded =
    drafts.length === 0 ? true : drafts.every(d => isDraftOpen(d.id))

  const toggleExpandAll = () => {
    if (allExpanded) {
      setCollapseAllActive(true)
      setOpenedWhileCollapsedIds(new Set())
    } else {
      setCollapseAllActive(false)
      setClosedIds(new Set())
      setOpenedWhileCollapsedIds(new Set())
    }
  }

  const toggleOpen = (id: string) => {
    if (collapseAllActive) {
      setOpenedWhileCollapsedIds(prev => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
        }
        return next
      })
      return
    }

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

  const handleOpenBookmark = (inspirationIds?: string[]) => {
    const firstInspirationId = inspirationIds?.[0]
    if (!firstInspirationId) {
      navigate({ to: '/bookmarks' })
      return
    }
    setBookmarkInspirationId(firstInspirationId)
    setBookmarkModalOpen(true)
  }

  if (isError) return <ErrorBanner />

  return (
    <>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-4 md:px-6">
        <h1 className="text-lg font-semibold">
          {isInspirationView ? (
            <span>Saved Draft</span>
          ) : showOnlyAutoPilot ? (
            <span className="flex items-center gap-2">
              <FolderHeart className="size-5" /> Generated Autopilot Drafts
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <FolderClosed className="size-5" /> Your Saved Drafts
            </span>
          )}
        </h1>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          {isInspirationView && (
            <Button
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => navigate({ to: '/drafts' })}
            >
              Show all drafts
            </Button>
          )}
          {!isInspirationView && !showOnlyAutoPilot && (
            <Button
              size="sm"
              className="w-full gap-1.5 sm:w-auto"
              onClick={() => navigate({ to: '/creation/create' })}
            >
              <Plus className="size-4" />
              Create post
            </Button>
          )}
        </div>
      </div>

      {!isInspirationView && (
        <div
          className={cn(
            !showOnlyAutoPilot &&
              'bg-secondary dark:bg-secondary/70 border-t border-b py-3',
            showOnlyAutoPilot && 'mx-auto w-full max-w-5xl px-3 sm:px-4 md:px-6'
          )}
        >
          <div
            className={cn(
              !showOnlyAutoPilot &&
                'mx-auto w-full max-w-5xl px-3 sm:px-4 md:px-6',
              showOnlyAutoPilot &&
                'bg-muted/40 rounded-md border px-3 py-3 sm:px-4 md:px-6'
            )}
          >
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
      )}

      <div
        className={cn(
          'mx-auto mt-4 mb-8 flex w-full max-w-5xl flex-col px-3 sm:px-4 md:px-6',
          isInspirationView && 'mt-0'
        )}
      >
        <div className="mt-4 flex flex-col gap-8">
          {/* Skeleton */}
          {isLoading && (
            <div className="bg-card rounded-lg border">
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
              <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
                <Skeleton className="h-40 rounded-lg" />
                <Skeleton className="h-40 rounded-lg" />
              </div>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && drafts.length === 0 && (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="bg-muted rounded-xl p-4">
                <FileText className="text-muted-foreground size-6" />
              </div>
              <p className="text-sm font-medium">
                {showOnlyAutoPilot
                  ? 'No generated drafts yet'
                  : isInspirationView
                    ? 'No drafts found for the given bookmark'
                    : 'No drafts yet'}
              </p>
              <p className="text-muted-foreground text-xs">
                {showOnlyAutoPilot
                  ? 'Your Autopilot generated drafts will appear here'
                  : isInspirationView
                    ? 'It could be either deleted or published'
                    : 'Your saved drafts will appear here.'}
              </p>
              {!showOnlyAutoPilot && !isInspirationView && (
                <Button
                  size="sm"
                  className="mt-1 gap-1.5"
                  onClick={() => navigate({ to: '/creation/create' })}
                >
                  <Plus className="size-4" />
                  Create post
                </Button>
              )}
            </div>
          )}

          {/* Draft rows */}
          {!isLoading &&
            drafts.map((draft: DraftItem, idx: number) => {
              const isOpen = isDraftOpen(draft.id)
              const isRenaming = renamingId === draft.id

              return (
                <Collapsible
                  key={draft.id}
                  open={isOpen}
                  onOpenChange={() => toggleOpen(draft.id)}
                  className={cn(
                    'bg-card rounded-lg border shadow',
                    deletingIds.has(draft.id) &&
                      'pointer-events-none opacity-40'
                  )}
                >
                  {/* Autopilot banner */}
                  {draft.autopilot && (
                    <div className="flex w-full items-center gap-1.5 rounded-t-lg border-b bg-violet-50 px-3 py-1.5 text-left text-xs font-medium text-violet-700 sm:px-4 dark:bg-violet-950/30 dark:text-violet-300">
                      <Bot className="size-3" />
                      <span>By Autopilot</span>
                      <span className="text-violet-400 dark:text-violet-500">
                        ·
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenBookmark(draft.inspiration_ids)
                        }
                        className="cursor-pointer text-violet-500 underline-offset-2 hover:underline dark:text-violet-400"
                      >
                        {draft.inspiration_ids?.length
                          ? 'View bookmark'
                          : 'View bookmarks'}
                      </button>
                      <ExternalLink className="ml-auto size-3 text-violet-400" />
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 sm:px-4">
                    {/* Left: expand trigger + title edit */}
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
                      <div className="flex min-w-0 flex-1 items-center gap-1.5">
                        <CollapsibleTrigger asChild>
                          <button className="hover:bg-muted/60 -mx-1 flex min-w-0 cursor-pointer items-center gap-2.5 rounded-md px-1 py-1 text-left transition-colors">
                            <ChevronDown
                              className={cn(
                                'text-muted-foreground size-4 shrink-0 transition-transform duration-200',
                                !isOpen && '-rotate-90'
                              )}
                            />
                            <span
                              className={cn(
                                'max-w-[16rem] truncate text-sm font-medium sm:max-w-[22rem]',
                                !draft.name?.trim() &&
                                  'text-muted-foreground italic'
                              )}
                            >
                              {draft.name?.trim() || 'Untitled'}
                            </span>
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

                        <Badge className="text-primary rounded-full bg-blue-100 dark:bg-blue-500">
                          <FileText /> Draft
                        </Badge>
                      </div>
                    )}

                    <div className="text-muted-foreground flex w-full min-w-0 items-center justify-between gap-2 text-xs sm:ml-auto sm:w-auto sm:shrink-0 sm:justify-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-7 gap-1.5 px-2 text-xs sm:px-3"
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
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => openDelete(draft.id)}
                            className="bg-destructive/10 focus:bg-destructive/20 dark:focus:bg-destructive/25 mt-1 rounded-md"
                          >
                            <Trash className="size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Expanded content */}
                  <CollapsibleContent className="bg-muted/60 relative rounded-b-lg shadow">
                    <Separator />
                    <div
                      className={cn(
                        'grid grid-cols-1 gap-4 p-3 sm:p-4',
                        'lg:grid-cols-2'
                      )}
                    >
                      {(
                        ['LinkedIn', 'Twitter', 'Instagram'] as channelType[]
                      ).map((channel, i) => {
                        const platform = SOCIAL_PLATFORM.find(
                          p => p.name === channel
                        )
                        const post = getPost(
                          `${draft.id}-${idx + i}`,
                          channel,
                          draft,
                          postId => openDeletePost(draft.id, postId)
                        )
                        if (!post || !platform) return null
                        return (
                          <div key={channel} className="flex flex-col gap-2">
                            <div className="flex items-center gap-1.5">
                              <platform.logo className="size-4" />
                              <p className="text-sm font-semibold">
                                {platform.label}
                              </p>
                            </div>
                            {post}
                          </div>
                        )
                      })}
                    </div>

                    <div className="text-accent-foreground/40 absolute top-0 right-0 flex items-center justify-end gap-2 p-4 font-medium">
                      <span
                        className="text-xs"
                        title={new Date(draft.updated_at).toString()}
                      >
                        {format(new Date(draft.updated_at), 'MMM d, h:mm a')}
                      </span>
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

        <BookmarkPreviewModal
          open={bookmarkModalOpen}
          onOpenChange={setBookmarkModalOpen}
          inspirationId={bookmarkInspirationId ?? ''}
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

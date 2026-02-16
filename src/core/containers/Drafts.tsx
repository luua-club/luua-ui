import { useNavigate } from '@tanstack/react-router'
import { format } from 'date-fns'
import {
  Bookmark,
  Bot,
  Calendar,
  CircleSlash,
  FolderClosed,
  FolderHeart,
  Loader,
  MoreHorizontal,
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
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
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

  // --- Handlers ---
  const handleDeleteDraft = (draftId: string) => openDelete(draftId)

  if (isError) {
    return <ErrorBanner />
  }

  return (
    <div
      className={cn(
        'm-auto flex max-w-4xl flex-col p-3 sm:p-5',
        showOnlyAutoPilot && 'p-0'
      )}
    >
      {/* --- Header --- */}
      <h1 className="text-lg font-bold">
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

      {/* --- Filters & Sorting --- */}
      <div className="mt-8">
        <ListControls
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          sort={sort}
          onSortChange={setSort}
          allDateSelectable
        />
      </div>

      {/* --- Drafts List --- */}
      <div className="mt-4 flex flex-col gap-4">
        {isLoading && <Loader className="mx-auto mt-8 size-5 animate-spin" />}

        {!isLoading && (
          <>
            {drafts.length === 0 && (
              <p className="mx-auto mt-8 flex items-center gap-2 text-sm font-semibold">
                <CircleSlash className="size-4" /> No drafts found
              </p>
            )}

            {drafts.map((draft: DraftItem, idx: number) => {
              return (
                <div
                  className={`dark:bg-sidebar/40 rounded-lg border-2 border-dotted p-4 pt-2 ${deletingIds.has(draft.id) ? 'pointer-events-none opacity-50' : ''}`}
                  key={draft.id}
                >
                  {/* --- Draft Header --- */}
                  <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    {/* --- Draft Date --- */}
                    <div
                      title={new Date(draft.updated_at).toString()}
                      className="flex flex-wrap items-center gap-2 text-xs font-semibold sm:text-sm"
                    >
                      {format(
                        new Date(draft.updated_at),
                        'MMM do, EEEE, hh:mm a'
                      )}
                      {draft.autopilot && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="outline"
                              className="rounded-xs border-orange-600 font-semibold text-orange-600 dark:border-orange-400 dark:text-orange-400"
                            >
                              <Bot className="!size-3.5" />
                              Autopilot
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <span>
                              This draft was generated automatically <br /> by
                              Luua through Autopilot Feature
                            </span>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {draft.inspiration_ids &&
                        draft.inspiration_ids.length > 0 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="outline"
                                className="cursor-pointer rounded-xs border-blue-600 font-semibold text-blue-600 dark:border-blue-400 dark:text-blue-400"
                                onClick={() => {
                                  setBookmarkInspirationId(
                                    draft.inspiration_ids![0]
                                  )
                                  setBookmarkModalOpen(true)
                                }}
                              >
                                <Bookmark className="!size-3.5" />
                                View Bookmark
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <span>View source bookmark</span>
                            </TooltipContent>
                          </Tooltip>
                        )}
                    </div>

                    {/* --- Draft Actions --- */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="!px-2"
                        onClick={() =>
                          navigate({
                            to: `/creation/create`,
                            search: {
                              draftId: draft.id,
                            },
                          })
                        }
                      >
                        <PencilRuler className="size-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="!px-2">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              navigate({
                                to: '/review/$draftId',
                                params: {
                                  draftId: draft.id,
                                },
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
                                params: {
                                  draftId: draft.id,
                                },
                                search: {
                                  schedule: 'true',
                                },
                              })
                            }
                          >
                            <Calendar className="size-4" />
                            Schedule
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onSelect={() => handleDeleteDraft(draft.id)}
                          >
                            <Trash className="size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* --- Draft Posts --- */}
                  <div
                    className={cn(
                      'mt-4 grid grid-cols-1 gap-4',
                      draft.posts.length > 1 && 'md:grid-cols-2'
                    )}
                  >
                    {getPost(`${draft.id}-${idx}`, 'LinkedIn', draft, postId =>
                      openDeletePost(draft.id, postId)
                    )}

                    {getPost(
                      `${draft.id}-${idx + 1}`,
                      'Twitter',
                      draft,
                      postId => openDeletePost(draft.id, postId)
                    )}
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>

      {/* --- Pagination --- */}
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

      {/* --- Confirm Dialog --- */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={open => (open ? undefined : closeDelete())}
        title={pendingDeletePost ? 'Delete post ?' : 'Delete draft ?'}
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

      {/* --- Bookmark Preview Modal --- */}
      <BookmarkPreviewModal
        open={bookmarkModalOpen}
        onOpenChange={setBookmarkModalOpen}
        inspirationId={bookmarkInspirationId ?? ''}
      />
    </div>
  )
}

const getPost = (
  id: string,
  channel: channelType,
  draftItem: DraftItem,
  onDelete: (postId: string) => void
) => {
  const item = draftItem.posts.find(post => post.channel === channel)

  if (!item) {
    return
  }

  return (
    <>
      <div className="relative">
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
          id={`${id}`}
          channel={item.channel}
          content={item.content}
          attached_media={item.attached_media}
          maintainFormatting
        />
      </div>
    </>
  )
}

export default Drafts

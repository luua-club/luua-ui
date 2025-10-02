import { useNavigate } from '@tanstack/react-router'
import { format } from 'date-fns'
import {
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

import ListControls from '../../core/components/ListControls'
import PaginationList from '../../shared/components/pagination-list'
import { useDraftList } from '../hooks/draft-list.hook'

interface DraftsProps {
  showOnlyAutoGen?: boolean
}

const Drafts = ({ showOnlyAutoGen = false }: DraftsProps) => {
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
  } = useDraftList(showOnlyAutoGen)
  const navigate = useNavigate()

  // --- Handlers ---
  const handleDeleteDraft = (draftId: string) => openDelete(draftId)

  if (isError) {
    return <ErrorBanner />
  }

  return (
    <div className="m-auto flex max-w-4xl flex-col p-5">
      {/* --- Header --- */}
      <h1 className="text-lg font-bold">
        {showOnlyAutoGen ? (
          <span className="flex items-center gap-2">
            <FolderHeart /> Your Generated AI Drafts
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <FolderClosed /> Your Saved Drafts
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
                  <div className="mb-2 flex items-center justify-between">
                    {/* --- Draft Date --- */}
                    <p
                      title={new Date(draft.updated_at).toString()}
                      className="flex items-center gap-2 text-xs font-semibold sm:text-base"
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
                              className="rounded-xs font-semibold text-cyan-600 dark:text-cyan-400"
                            >
                              <Bot />
                              Auto Gen
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <span>
                              This draft was generated automatically <br /> by
                              Luua through Auto Gen Feature
                            </span>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </p>

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
                        Edit
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
                                to: `/creation/create`,
                                search: {
                                  draftId: draft.id,
                                  publish: true,
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
                                to: `/creation/create`,
                                search: {
                                  draftId: draft.id,
                                  schedule: true,
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
                    className={`mt-4 grid grid-cols-1 gap-4 lg:grid-cols-${draft.posts.length > 1 ? '2' : '1'}`}
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
          maintainFormatting
        />
      </div>
    </>
  )
}

export default Drafts

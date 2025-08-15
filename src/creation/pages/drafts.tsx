import { createLazyRoute } from '@tanstack/react-router'
import { format } from 'date-fns'
import {
  Calendar,
  MoreHorizontal,
  PencilRuler,
  Send,
  Trash,
  X,
} from 'lucide-react'

import Post, { PostSkeleton } from '@/core/components/Post'
import { DraftItem } from '@/core/models/draft.model'
import { channelType } from '@/core/models/social.model'
import ConfirmDialog from '@/shared/components/confirm-dialog'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'

import PaginationList from '../../shared/components/pagination-list'
import DraftListControls from '../components/DraftListControls'
import { useDraftList } from '../hooks/draft-list.hook'

const Drafts = () => {
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
  } = useDraftList()

  const handleDeleteDraft = (draftId: string) => openDelete(draftId)

  if (isError) {
    return (
      <div className="bg-sidebar m-auto mt-8 flex h-24 max-w-4xl items-center justify-center rounded-lg border-1 p-5">
        <p className="text-sm font-semibold">
          Something Went Wrong, Please retry after some time
        </p>
      </div>
    )
  }

  return (
    <div className="m-auto flex max-w-4xl flex-col p-5">
      <h1 className="text-xl font-semibold">Your Saved Drafts</h1>

      <div className="mt-8">
        <DraftListControls
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          sort={sort}
          onSortChange={setSort}
        />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {isLoading && (
          <div className="bg-sidebar rounded-lg border-1 p-4">
            <PostSkeleton />
          </div>
        )}
        {!isLoading && (
          <>
            {drafts.length === 0 && (
              <div className="bg-sidebar flex h-24 items-center justify-center rounded-lg border-1">
                <p className="text-sm font-semibold">No drafts found</p>
              </div>
            )}
            {drafts.map((draft: DraftItem, idx: number) => {
              return (
                <div
                  className={`bg-sidebar rounded-lg border-1 p-4 pt-2 ${deletingIds.has(draft.id) ? 'pointer-events-none opacity-50' : ''}`}
                  key={draft.id}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p
                      title={new Date(draft.updated_at).toString()}
                      className="text-xs font-semibold sm:text-base"
                    >
                      {format(
                        new Date(draft.updated_at),
                        'EEE, MMM d, hh:mm a'
                      )}
                    </p>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" className="!px-2">
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
                          <DropdownMenuItem>
                            <Send className="size-4" />
                            Publish
                          </DropdownMenuItem>
                          <DropdownMenuItem>
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
                  <div className="mt-4 flex flex-col gap-4">
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
            className="absolute -top-2 -right-2 z-10 size-6 rounded-full !p-0"
            variant="outline"
            size="icon"
            onClick={() => onDelete(item.id)}
          >
            <X />
          </Button>
        )}
        <Post
          id={`${id}`}
          channel={item.channel}
          content={item.content}
          attached_media={item.attached_media}
          fullView
        />
      </div>
    </>
  )
}

export const Route = createLazyRoute('/creation/drafts')({
  component: Drafts,
})

export default Drafts

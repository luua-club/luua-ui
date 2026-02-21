import { useMutation, useQuery } from '@tanstack/react-query'
import { createLazyRoute, Link, useNavigate } from '@tanstack/react-router'
import { formatDistanceToNow } from 'date-fns'
import { FileText, FolderEdit, Pencil, Plus } from 'lucide-react'
import { toast } from 'sonner'

import { draftsApi } from '@/core/api/drafts.api'
import { QUERY_KEYS, SOCIAL_PLATFORM } from '@/core/config/constant'
import { queryClient } from '@/core/config/global.config'
import { type DraftItem } from '@/core/models/draft.model'
import { type channelType } from '@/core/models/social.model'
import AnalyticsCards from '@/dashboard/components/analytics-cards'
import RenameDraftPopover from '@/dashboard/components/rename-draft-popover'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardFooter } from '@/shared/ui/card'
import { Separator } from '@/shared/ui/separator'
import { Skeleton } from '@/shared/ui/skeleton'

// ---------------------------------------------------------------------------
// StackedPlatformIcons
// ---------------------------------------------------------------------------
function StackedPlatformIcons({ channels }: { channels: channelType[] }) {
  const platforms = channels
    .map(ch => SOCIAL_PLATFORM.find(s => s.name === ch))
    .filter(Boolean) as (typeof SOCIAL_PLATFORM)[number][]

  return (
    <div className="flex shrink-0 items-center">
      {platforms.map((platform, i) => {
        const Logo = platform.logo
        return (
          <span
            key={platform.name}
            className="flex items-center justify-center rounded-full border border-dashed"
            style={{ width: 26, height: 26, marginLeft: i === 0 ? 0 : -4 }}
            title={platform.name}
          >
            <Logo width={14} height={14} />
          </span>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// DraftCard
// ---------------------------------------------------------------------------
interface DraftCardProps {
  draft: DraftItem
  onClick: () => void
  onRenameSave: (name: string) => void
  isRenaming?: boolean
}

function DraftCard({
  draft,
  onClick,
  onRenameSave,
  isRenaming = false,
}: DraftCardProps) {
  const previewPost = draft.posts.find(p => p.content?.trim()) ?? draft.posts[0]
  const previewText = previewPost?.content ?? ''
  const channels = draft.posts.map(p => p.channel)

  return (
    <Card
      onClick={e => {
        if (e.defaultPrevented) return
        onClick()
      }}
      className="bg-card/70 h-44 w-full min-w-0 cursor-pointer gap-0 overflow-hidden rounded-md border p-0 shadow-none transition-shadow hover:shadow-md"
    >
      <CardContent className="h-full p-3">
        {previewText ? (
          <p className="text-foreground/90 line-clamp-6 text-[10px] leading-relaxed break-words">
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
          <div className="flex items-center justify-between">
            <p className="text-foreground truncate text-xs leading-tight font-medium">
              {draft.name || 'Untitled'}
            </p>
            <RenameDraftPopover
              initialName={draft.name || 'Untitled'}
              isSaving={isRenaming}
              onSave={onRenameSave}
            >
              <button
                type="button"
                aria-label="Rename draft"
                onPointerDown={e => {
                  e.stopPropagation()
                }}
                onMouseDown={e => {
                  e.stopPropagation()
                }}
                onClick={e => {
                  e.stopPropagation()
                }}
                className="hover:bg-muted cursor-pointer rounded p-1"
              >
                <Pencil className="size-3" />
              </button>
            </RenameDraftPopover>
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
// NewPostCard
// ---------------------------------------------------------------------------
function NewPostCard({ onClick }: { onClick: () => void }) {
  return (
    <Card
      onClick={onClick}
      className="bg-card/70 h-44 w-full min-w-0 cursor-pointer gap-0 overflow-hidden rounded-md border-dashed p-0 shadow-none"
    >
      <CardContent className="flex h-full flex-col items-center justify-center gap-2 p-3">
        <Plus className="size-8" />
        <span className="text-sm font-medium">New Draft</span>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// DraftCardSkeleton
// ---------------------------------------------------------------------------
function DraftCardSkeleton() {
  return (
    <Card className="bg-card/70 h-44 w-full min-w-0 cursor-pointer gap-0 overflow-hidden rounded-md border p-0 shadow-none transition-shadow hover:shadow-md">
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
// DashboardPage
// ---------------------------------------------------------------------------
function DashboardPage() {
  const navigate = useNavigate()

  const { data, isPending } = useQuery({
    queryKey: [QUERY_KEYS.drafts, 'dashboard', 7],
    queryFn: () => draftsApi.getDrafts({ limit: 7, offset: 0, sort: 'desc' }),
    staleTime: 30_000,
  })

  const drafts: DraftItem[] = data?.data?.posts ?? []

  const renameMutation = useMutation({
    mutationFn: (payload: { id: string; name: string }) =>
      draftsApi.renameDraft({
        id: payload.id,
        name: payload.name,
      }),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.drafts] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.draft, variables.id],
      })
      toast.success('Draft renamed')
    },
    onError: () => {
      toast.error('Failed to rename draft')
    },
  })

  const handleDraftClick = (draftId: string) => {
    navigate({ to: '/creation/create', search: { draftId } })
  }

  const handleNewPost = () => {
    navigate({ to: '/creation/create' })
  }

  return (
    <div className="bg-accent/60 dark:bg-background min-h-screen pt-8">
      <AnalyticsCards />

      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <h1 className="mb-4 flex gap-2 text-sm font-semibold">
          <FolderEdit className="size-5" /> Pick Up Where You Left Off
        </h1>

        <div className="grid grid-cols-1 gap-4 pb-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <NewPostCard onClick={handleNewPost} />

          {isPending && <DraftCardSkeleton />}

          {!isPending &&
            drafts.map(draft => (
              <DraftCard
                key={draft.id}
                draft={draft}
                onClick={() => handleDraftClick(draft.id)}
                onRenameSave={name =>
                  renameMutation.mutate({ id: draft.id, name })
                }
                isRenaming={renameMutation.isPending}
              />
            ))}
        </div>

        {!isPending && drafts.length === 0 && (
          <p className="text-muted-foreground mt-2 text-xs">
            No drafts yet. Click &quot;New Draft&quot; to get started.
          </p>
        )}

        {drafts.length >= 1 && (
          <div className="flex justify-end">
            <Button variant={'link'} className="text-xs" asChild>
              <Link to="/drafts">View all</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export const Route = createLazyRoute('/dashboard')({
  component: DashboardPage,
})

export default DashboardPage

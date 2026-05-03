import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { FolderEdit, LucideArrowRight } from 'lucide-react'
import { toast } from 'sonner'

import { draftsApi } from '@/core/api/drafts.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { queryClient } from '@/core/config/global.config'
import { type ApiResponse } from '@/core/models/api.model'
import {
  type DraftItem,
  type IDraftListResponse,
} from '@/core/models/draft.model'
import { Button } from '@/shared/ui/button'

import {
  DraftCard,
  DraftCardSkeleton,
  NewPostCard,
} from '../components/draft-card'

const DASHBOARD_DRAFTS_QUERY_KEY = [QUERY_KEYS.drafts, 'dashboard', 7] as const

type DashboardDraftsCache = ApiResponse<IDraftListResponse>

// ---------------------------------------------------------------------------
// DashboardDraftGrid
// ---------------------------------------------------------------------------
export default function DashboardDraftGrid() {
  const navigate = useNavigate()

  // ---- Query ----
  const { data, isPending } = useQuery({
    queryKey: DASHBOARD_DRAFTS_QUERY_KEY,
    queryFn: () => draftsApi.getDrafts({ limit: 7, offset: 0, sort: 'desc' }),
    staleTime: 30_000,
  })

  // ---- Mutations (optimistic cache updates; API runs here only) ----
  const renameMutation = useMutation({
    mutationFn: (payload: { id: string; name: string }) =>
      draftsApi.renameDraft({ id: payload.id, name: payload.name }),
    onMutate: async ({ id, name }) => {
      await queryClient.cancelQueries({ queryKey: DASHBOARD_DRAFTS_QUERY_KEY })
      const previous = queryClient.getQueryData<DashboardDraftsCache>(
        DASHBOARD_DRAFTS_QUERY_KEY
      )
      const previousDetail = queryClient.getQueryData<DraftItem>([
        QUERY_KEYS.draft,
        id,
      ])
      const now = new Date().toISOString()

      queryClient.setQueryData<DashboardDraftsCache>(
        DASHBOARD_DRAFTS_QUERY_KEY,
        old => {
          if (!old?.data?.posts) return old
          return {
            ...old,
            data: {
              ...old.data,
              posts: old.data.posts.map(p =>
                p.id === id ? { ...p, name, updated_at: now } : p
              ),
            },
          }
        }
      )

      queryClient.setQueryData<DraftItem | undefined>(
        [QUERY_KEYS.draft, id],
        old => (old ? { ...old, name, updated_at: now } : old)
      )

      return { previous, previousDetail, id }
    },
    onError: (_err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(DASHBOARD_DRAFTS_QUERY_KEY, context.previous)
      }
      if (context?.previousDetail !== undefined) {
        queryClient.setQueryData(
          [QUERY_KEYS.draft, variables.id],
          context.previousDetail
        )
      }
      toast.error('Failed to rename draft')
    },
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.drafts] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.draft, variables.id],
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (draftId: string) => draftsApi.deleteDraft(draftId),
    onMutate: async draftId => {
      await queryClient.cancelQueries({ queryKey: DASHBOARD_DRAFTS_QUERY_KEY })
      const previous = queryClient.getQueryData<DashboardDraftsCache>(
        DASHBOARD_DRAFTS_QUERY_KEY
      )

      queryClient.setQueryData<DashboardDraftsCache>(
        DASHBOARD_DRAFTS_QUERY_KEY,
        old => {
          if (!old?.data?.posts) return old
          return {
            ...old,
            data: {
              ...old.data,
              posts: old.data.posts.filter(p => p.id !== draftId),
              total: Math.max(0, old.data.total - 1),
            },
          }
        }
      )

      queryClient.removeQueries({ queryKey: [QUERY_KEYS.draft, draftId] })

      return { previous }
    },
    onError: (_err, _draftId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(DASHBOARD_DRAFTS_QUERY_KEY, context.previous)
      }
      toast.error('Failed to delete draft')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.drafts] })
    },
  })

  // ---- Derived state ----
  const drafts: DraftItem[] = data?.data?.posts ?? []

  // ---- Handlers ----
  const handleDraftClick = (draftId: string) => {
    navigate({ to: '/creation/create', search: { draftId } })
  }

  const handleNewPost = () => {
    navigate({ to: '/creation/create' })
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-4 flex items-center gap-6">
        <h1 className="flex gap-2 text-sm font-semibold">
          <FolderEdit className="size-5" /> Pick Up Where You Left Off
        </h1>

        <Button className="!h-6 rounded-sm px-3 text-xs" asChild>
          <Link to="/drafts">
            view all <LucideArrowRight className="size-3" />
          </Link>
        </Button>
      </div>

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
              onDelete={() => deleteMutation.mutate(draft.id)}
              isRenamePending={
                renameMutation.isPending &&
                renameMutation.variables?.id === draft.id
              }
              isDeletePending={
                deleteMutation.isPending &&
                deleteMutation.variables === draft.id
              }
            />
          ))}
      </div>

      {!isPending && drafts.length === 0 && (
        <p className="text-muted-foreground mt-2 text-xs">
          No drafts yet. Click &quot;New Draft&quot; to get started.
        </p>
      )}
    </div>
  )
}

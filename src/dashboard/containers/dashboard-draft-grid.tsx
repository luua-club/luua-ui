import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { ExternalLink, FolderEdit, Plus } from 'lucide-react'
import { toast } from 'sonner'

import { draftsApi } from '@/core/api/drafts.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { queryClient } from '@/core/config/global.config'
import { type ApiResponse } from '@/core/models/api.model'
import {
  type DraftItem,
  type IDraftListResponse,
} from '@/core/models/draft.model'
import {
  DASHBOARD_DRAFTS_GC_TIME,
  DASHBOARD_DRAFTS_QUERY_KEY,
  DASHBOARD_DRAFTS_STALE_TIME,
} from '@/dashboard/config/dashboard-queries'
import { Button } from '@/shared/ui/button'

import { DashboardDraftsEmptyState } from '../components/dashboard-drafts-empty-state'
import { DashboardDraftGridSkeleton } from '../components/dashboard-skeletons'
import { DraftCard } from '../components/draft-card'

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
    staleTime: DASHBOARD_DRAFTS_STALE_TIME,
    gcTime: DASHBOARD_DRAFTS_GC_TIME,
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
  const hasDrafts = drafts.length > 0

  // ---- Handlers ----
  const handleDraftClick = (draftId: string) => {
    navigate({ to: '/creation/create', search: { draftId } })
  }

  if (isPending || !data) {
    return <DashboardDraftGridSkeleton />
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="flex min-w-0 flex-wrap items-end gap-x-2.5 gap-y-1">
          <span className="flex items-center gap-2 text-base font-semibold">
            <FolderEdit className="size-5 shrink-0" />
            Saved Drafts
          </span>
          {hasDrafts && (
            <Link
              to="/drafts"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 pb-px text-[11px] font-medium transition-colors"
            >
              View All
              <ExternalLink className="size-3 shrink-0" />
            </Link>
          )}
        </h1>

        {hasDrafts && (
          <Button
            size="sm"
            className="h-8 shrink-0 gap-1.5 px-3 text-xs"
            asChild
          >
            <Link to="/creation/create">
              <Plus className="size-3.5" />
              Create post
            </Link>
          </Button>
        )}
      </div>

      {hasDrafts ? (
        <div className="grid grid-cols-1 gap-4 pb-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {drafts.map(draft => (
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
      ) : (
        <DashboardDraftsEmptyState />
      )}
    </div>
  )
}

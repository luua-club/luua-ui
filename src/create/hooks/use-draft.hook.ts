import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { draftsApi } from '@/core/api/drafts.api'
import { QUERY_KEYS, SOCIAL_PLATFORM } from '@/core/config/constant'
import { queryClient } from '@/core/config/global.config'
import { WithOptional } from '@/core/models/common.model'
import { DraftItem, IDraftRequest, PostItem } from '@/core/models/draft.model'
import { MediaObject } from '@/core/models/post.model'
import { channelType } from '@/core/models/social.model'

type PostDrafts = Partial<Record<channelType, WithOptional<PostItem, 'id'>>>
type SaveSource = 'auto' | 'manual'

export type SaveStatus = 'idle' | 'pending' | 'saved'

const AUTO_SAVE_DELAY_MS = 1500
const SAVED_INDICATOR_DURATION_MS = 2000

function hasDraftContent(draft?: WithOptional<PostItem, 'id'>) {
  return Boolean(
    draft?.content?.trim() || (draft?.attached_media?.length ?? 0) > 0
  )
}

export function useDraft() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/create' })
  const draftId = search.draftId

  const [postDrafts, setPostDrafts] = useState<PostDrafts>({})
  const [draftName, setDraftName] = useState('')
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  // Source-of-truth ID used during save orchestration. This prevents duplicate
  // draft creation when a queued save runs before router search params update.
  const activeDraftIdRef = useRef<string | null>(draftId ?? null)

  // True only after real user edits. API hydration should not trigger autosave.
  const isDirtyRef = useRef(false)
  // Prevent multiple concurrent saves and keep one queued save as "latest intent".
  const isSavingRef = useRef(false)
  const queuedSaveSourceRef = useRef<SaveSource | null>(null)
  // Hydrate a draft exactly once per draft ID; afterwards local editor state wins.
  const hydratedDraftIdRef = useRef<string | null>(null)

  // Debounce + UI indicator timers.
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const saveStatusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearAutoSaveTimer = useCallback(() => {
    if (!autoSaveTimerRef.current) return
    clearTimeout(autoSaveTimerRef.current)
    autoSaveTimerRef.current = null
  }, [])

  const clearSaveStatusTimer = useCallback(() => {
    if (!saveStatusTimerRef.current) return
    clearTimeout(saveStatusTimerRef.current)
    saveStatusTimerRef.current = null
  }, [])

  useEffect(() => {
    activeDraftIdRef.current = draftId ?? null
  }, [draftId])

  // ─── Load existing draft ───────────────────────────────────────────────────

  const draftQuery = useQuery<DraftItem>({
    queryKey: [QUERY_KEYS.draft, draftId],
    queryFn: async () => {
      const res = await draftsApi.getDraft(draftId as string)
      return res.data
    },
    enabled: Boolean(draftId),
    staleTime: 0,
    gcTime: 0,
  })

  useEffect(() => {
    if (!draftQuery.data) return

    const incomingDraftId = draftQuery.data.id
    // Ignore repeat updates for the same draft ID to protect in-progress typing.
    if (hydratedDraftIdRef.current === incomingDraftId) return

    hydratedDraftIdRef.current = incomingDraftId
    isDirtyRef.current = false
    clearAutoSaveTimer()
    clearSaveStatusTimer()
    setSaveStatus('idle')

    const nextDrafts: PostDrafts = {}

    draftQuery.data.posts.forEach(post => {
      nextDrafts[post.channel] = post
    })

    setPostDrafts(nextDrafts)
    setDraftName(draftQuery.data.name ?? '')
    setUpdatedAt(draftQuery.data.updated_at ?? null)
  }, [clearAutoSaveTimer, clearSaveStatusTimer, draftQuery.data])

  // Reset state when navigating to a fresh /create (no draftId).
  useEffect(() => {
    if (draftId) return

    hydratedDraftIdRef.current = null
    isDirtyRef.current = false
    isSavingRef.current = false
    queuedSaveSourceRef.current = null

    clearAutoSaveTimer()
    clearSaveStatusTimer()

    setPostDrafts({})
    setDraftName('')
    setUpdatedAt(null)
    setSaveStatus('idle')
  }, [clearAutoSaveTimer, clearSaveStatusTimer, draftId])

  // Clean up timers on unmount.
  useEffect(() => {
    return () => {
      clearAutoSaveTimer()
      clearSaveStatusTimer()
    }
  }, [clearAutoSaveTimer, clearSaveStatusTimer])

  // ─── Content handlers ──────────────────────────────────────────────────────

  const handleContentChange = useCallback(
    (val: string, channel: channelType) => {
      isDirtyRef.current = true
      setPostDrafts(prev => ({
        ...prev,
        [channel]: {
          ...(prev[channel] ?? { channel, attached_media: [] }),
          content: val,
        },
      }))
    },
    []
  )

  const handleImagesChange = useCallback(
    (images: MediaObject[], channel: channelType) => {
      isDirtyRef.current = true
      setPostDrafts(prev => ({
        ...prev,
        [channel]: {
          ...(prev[channel] ?? { channel, content: '' }),
          attached_media: images,
        },
      }))
    },
    []
  )

  // ─── Computed ──────────────────────────────────────────────────────────────

  // Draft is valid only when at least one social post has text or media.
  const hasContent = SOCIAL_PLATFORM.some(({ name }) =>
    hasDraftContent(postDrafts[name as channelType])
  )

  const hasContentRef = useRef(hasContent)
  hasContentRef.current = hasContent

  // ─── Payload builder (shared by manual + auto save) ───────────────────────

  const buildPayload = useCallback((): IDraftRequest => {
    const payload: IDraftRequest = { posts: [] }

    const activeDraftId = activeDraftIdRef.current

    if (activeDraftId) payload.id = activeDraftId
    if (draftName) payload.name = draftName

    // Always evaluate all socials; include only posts that have content/media.
    SOCIAL_PLATFORM.forEach(({ name }) => {
      const channel = name as channelType
      const draft = postDrafts[channel]
      if (!hasDraftContent(draft)) return

      payload.posts.push({
        ...(draft?.id ? { id: draft.id } : {}),
        channel,
        content: draft?.content ?? '',
        attached_media: draft?.attached_media?.map(m => ({ url: m.url })),
      })
    })

    return payload
  }, [draftName, postDrafts])

  const buildPayloadRef = useRef(buildPayload)
  buildPayloadRef.current = buildPayload

  // ─── Mutations ─────────────────────────────────────────────────────────────

  const saveMutation = useMutation({
    mutationFn: ({ payload }: { payload: IDraftRequest }) =>
      draftsApi.postDraft(payload),
  })

  const renameMutation = useMutation({
    mutationFn: (name: string) =>
      draftsApi.renameDraft({ id: draftId as string, name }),
    onSuccess: () => toast.success('Draft renamed'),
    onError: () => toast.error('Failed to rename draft'),
  })

  // ─── Save coordinator (single-flight + queue) ─────────────────────────────

  const runSave = useCallback(
    async (source: SaveSource) => {
      if (!hasContentRef.current) {
        setSaveStatus('idle')
        return
      }

      clearSaveStatusTimer()
      isSavingRef.current = true
      setSaveStatus('pending')

      try {
        const response = await saveMutation.mutateAsync({
          payload: buildPayloadRef.current(),
        })
        const saved = response.data.draft

        isDirtyRef.current = false
        activeDraftIdRef.current = saved.id
        // Mark this ID as already hydrated so post-save query updates never
        // clobber local typing.
        hydratedDraftIdRef.current = saved.id

        // Merge server-assigned post IDs without replacing local content/media.
        setPostDrafts(prev => {
          const next = { ...prev }
          saved.posts.forEach(post => {
            if (!next[post.channel]) return
            next[post.channel] = { ...next[post.channel]!, id: post.id }
          })
          return next
        })
        setDraftName(prev => prev || (saved.name ?? ''))
        setUpdatedAt(saved.updated_at ?? null)

        queryClient.setQueryData([QUERY_KEYS.draft, saved.id], saved)
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.drafts] })

        navigate({
          to: '/create',
          search: { draftId: saved.id },
          replace: true,
        })

        if (source === 'manual') {
          toast.success('Draft saved')
        }

        // Only show "Saved" when no additional save is queued.
        if (queuedSaveSourceRef.current) {
          setSaveStatus('pending')
        } else {
          setSaveStatus('saved')
          saveStatusTimerRef.current = setTimeout(() => {
            if (!isSavingRef.current && !queuedSaveSourceRef.current) {
              setSaveStatus('idle')
            }
          }, SAVED_INDICATOR_DURATION_MS)
        }
      } catch {
        setSaveStatus('idle')
        if (source === 'manual') {
          toast.error('Failed to save draft')
        }
      } finally {
        isSavingRef.current = false

        const queuedSource = queuedSaveSourceRef.current
        queuedSaveSourceRef.current = null

        if (queuedSource) {
          void runSave(queuedSource)
        }
      }
    },
    [clearSaveStatusTimer, navigate, saveMutation]
  )

  const requestSave = useCallback(
    (source: SaveSource) => {
      if (!hasContentRef.current) {
        setSaveStatus('idle')
        return
      }

      if (isSavingRef.current) {
        // Manual save intent is higher priority than auto-save intent.
        if (source === 'manual' || queuedSaveSourceRef.current !== 'manual') {
          queuedSaveSourceRef.current = source
        }
        setSaveStatus('pending')
        return
      }

      void runSave(source)
    },
    [runSave]
  )

  // ─── Auto-save debounce ────────────────────────────────────────────────────

  useEffect(() => {
    if (!isDirtyRef.current || !hasContent) return

    clearAutoSaveTimer()
    setSaveStatus('pending')

    autoSaveTimerRef.current = setTimeout(() => {
      requestSave('auto')
    }, AUTO_SAVE_DELAY_MS)

    return () => clearAutoSaveTimer()
  }, [clearAutoSaveTimer, hasContent, postDrafts, requestSave])

  // ─── Manual save ───────────────────────────────────────────────────────────

  const handleSaveDraft = useCallback(() => {
    if (!hasContent) return

    // Manual save should execute immediately and not be delayed by an old timer.
    clearAutoSaveTimer()
    requestSave('manual')
  }, [clearAutoSaveTimer, hasContent, requestSave])

  // ─── Rename draft ──────────────────────────────────────────────────────────

  const handleRenameDraft = useCallback(
    (name: string) => {
      setDraftName(name)
      if (draftId) renameMutation.mutate(name)
    },
    [draftId, renameMutation]
  )

  // ─── Return ────────────────────────────────────────────────────────────────

  return {
    postDrafts,
    draftName,
    draftId,
    updatedAt,
    saveStatus,
    isLoading: Boolean(draftId) && draftQuery.isPending,
    isRenaming: renameMutation.isPending,
    hasContent,
    handleContentChange,
    handleImagesChange,
    handleSaveDraft,
    handleRenameDraft,
  }
}

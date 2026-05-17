import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import { draftsApi } from '@/core/api/drafts.api'
import {
  API_CONSTANTS,
  POST_WORD_COUNT,
  QUERY_KEYS,
  SOCIAL_PLATFORM,
} from '@/core/config/constant'
import { queryClient } from '@/core/config/global.config'
import { ApiError } from '@/core/models/api.model'
import { WithOptional } from '@/core/models/common.model'
import {
  DraftItem,
  IDraftRequest,
  ILockedByUser,
  PostItem,
} from '@/core/models/draft.model'
import { MediaObject } from '@/core/models/post.model'
import { channelType } from '@/core/models/social.model'

type PostDrafts = Partial<Record<channelType, WithOptional<PostItem, 'id'>>>
type SaveSource = 'auto' | 'manual'

export type SaveStatus = 'idle' | 'pending' | 'saved'

const AUTO_SAVE_DELAY_MS = 1500
const SAVED_INDICATOR_DURATION_MS = 2000
const LOCK_RENEWAL_INTERVAL_MS = 30 * 1000 // 30 seconds

function hasDraftContent(draft?: WithOptional<PostItem, 'id'>) {
  return Boolean(
    draft?.content?.trim() || (draft?.attached_media?.length ?? 0) > 0
  )
}

export function useDraft() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/creation/create' })
  const draftId = search.draftId

  const allChannels = useMemo(
    () => SOCIAL_PLATFORM.map(platform => platform.name as channelType),
    []
  )
  const [postDrafts, setPostDrafts] = useState<PostDrafts>({})
  const [draftName, setDraftName] = useState('')
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [isLocked, setIsLocked] = useState<boolean | null>(null)
  const [lockedByUser, setLockedByUser] = useState<ILockedByUser | null>(null)
  const [enabledChannels, setEnabledChannels] =
    useState<channelType[]>(allChannels)
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

  // Version tracking
  const versionRef = useRef<number | null>(null)
  // Lock tracking
  const lockAcquiredRef = useRef(false)
  const lockRenewalTimerRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  )
  // Tracks which draftId we've already attempted to lock — prevents re-runs.
  const lockAttemptedForRef = useRef<string | null>(null)

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

  const clearLockRenewalTimer = useCallback(() => {
    if (!lockRenewalTimerRef.current) return
    clearInterval(lockRenewalTimerRef.current)
    lockRenewalTimerRef.current = null
  }, [])

  useEffect(() => {
    activeDraftIdRef.current = draftId ?? null
  }, [draftId])

  useEffect(() => {
    if (enabledChannels.length > 0) return
    if (draftId) {
      setEnabledChannels(allChannels.slice(0, 1))
      return
    }
    setEnabledChannels(allChannels)
  }, [allChannels, draftId, enabledChannels.length])

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

    // Track version from server
    versionRef.current = draftQuery.data.version

    const nextDrafts: PostDrafts = {}
    const enabledFromContent = new Set<channelType>()

    draftQuery.data.posts.forEach(post => {
      nextDrafts[post.channel] = post
      if (hasDraftContent(post)) {
        enabledFromContent.add(post.channel)
      }
    })

    setPostDrafts(nextDrafts)
    setDraftName(draftQuery.data.name ?? '')
    setUpdatedAt(draftQuery.data.updated_at ?? null)
    setEnabledChannels(
      enabledFromContent.size > 0
        ? Array.from(enabledFromContent)
        : allChannels.slice(0, 1)
    )
  }, [allChannels, clearAutoSaveTimer, clearSaveStatusTimer, draftQuery.data])

  // ─── Lock lifecycle ─────────────────────────────────────────────────────────

  // Acquire lock once per draftId (after the draft query succeeds).
  // Using `draftQuery.isSuccess` (boolean) instead of `draftQuery.data` (object)
  // to avoid re-running on every refetch / setQueryData.
  useEffect(() => {
    if (!draftId || !draftQuery.isSuccess) return
    // Only attempt lock once per draft — avoid re-acquiring on effect re-runs.
    if (lockAttemptedForRef.current === draftId) return
    lockAttemptedForRef.current = draftId

    let cancelled = false

    const handleLockFailure = (res?: {
      data: { locked_by: ILockedByUser }
    }) => {
      lockAcquiredRef.current = false
      setIsLocked(false)
      setLockedByUser(
        res?.data?.locked_by ?? {
          user_id: '',
          user_name: 'Another user',
          email: '',
        }
      )
    }

    const acquireLock = async () => {
      try {
        const res = await draftsApi.lockDraft(draftId)
        if (cancelled) return

        if (!res.data.lock_acquired) {
          handleLockFailure(res)
          return
        }

        lockAcquiredRef.current = true
        setIsLocked(true)

        // Set up periodic renewal
        clearLockRenewalTimer()
        lockRenewalTimerRef.current = setInterval(async () => {
          try {
            const renewRes = await draftsApi.lockDraft(draftId)
            if (!renewRes.data.lock_acquired) {
              clearLockRenewalTimer()
              handleLockFailure(renewRes)
            }
          } catch {
            // Lock renewal failed — another user may have taken over
            clearLockRenewalTimer()
            handleLockFailure()
          }
        }, LOCK_RENEWAL_INTERVAL_MS)
      } catch {
        if (cancelled) return
        handleLockFailure()
      }
    }

    acquireLock()

    return () => {
      cancelled = true
      clearLockRenewalTimer()
      lockAttemptedForRef.current = null

      // Release lock on unmount — only if we actually hold it
      if (lockAcquiredRef.current) {
        lockAcquiredRef.current = false
        draftsApi.unlockDraft(draftId).catch(() => {
          // Best effort — ignore unlock errors on unmount
        })
      }
      setIsLocked(null)
    }
  }, [draftId, draftQuery.isSuccess, clearLockRenewalTimer])

  // Reset state when navigating to a fresh /create (no draftId).
  useEffect(() => {
    if (draftId) return

    hydratedDraftIdRef.current = null
    isDirtyRef.current = false
    isSavingRef.current = false
    queuedSaveSourceRef.current = null
    versionRef.current = null
    lockAttemptedForRef.current = null
    setIsLocked(null)
    setLockedByUser(null)

    clearAutoSaveTimer()
    clearSaveStatusTimer()
    clearLockRenewalTimer()

    setPostDrafts({})
    setDraftName('')
    setUpdatedAt(null)
    setSaveStatus('idle')
  }, [clearAutoSaveTimer, clearSaveStatusTimer, clearLockRenewalTimer, draftId])

  // Clean up timers on unmount.
  useEffect(() => {
    return () => {
      clearAutoSaveTimer()
      clearSaveStatusTimer()
      clearLockRenewalTimer()
    }
  }, [clearAutoSaveTimer, clearSaveStatusTimer, clearLockRenewalTimer])

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

  const setChannelEnabled = useCallback(
    (channel: channelType, enabled: boolean) => {
      setEnabledChannels(prev => {
        if (enabled) {
          if (prev.includes(channel)) return prev
          return [...prev, channel]
        }
        if (prev.length <= 1 && !(prev.length === 1 && prev[0] === 'Instagram'))
          return prev
        return prev.filter(item => item !== channel)
      })

      if (!draftId) return
      if (!enabled) {
        isDirtyRef.current = true
      }
    },
    [draftId]
  )

  // ─── Computed ──────────────────────────────────────────────────────────────

  // Draft is valid only when at least one social post has text or media.
  const hasContent = enabledChannels.some(channel =>
    hasDraftContent(postDrafts[channel])
  )

  // True when any post's content exceeds its platform character limit.
  const hasExceededCharLimit = enabledChannels.some(channel => {
    const content = postDrafts[channel]?.content ?? ''
    return content.length > POST_WORD_COUNT[channel]
  })

  const hasContentRef = useRef(hasContent)
  hasContentRef.current = hasContent

  // Read-only when we have an existing draft and lock is not confirmed acquired.
  // This covers: lock pending (null), lock failed (false).
  // New drafts (no draftId) are never read-only.
  const isReadOnly = Boolean(draftId) && isLocked !== true

  // ─── Payload builder (shared by manual + auto save) ───────────────────────

  const buildPayload = useCallback((): IDraftRequest => {
    const payload: IDraftRequest = { posts: [] }

    const activeDraftId = activeDraftIdRef.current

    if (activeDraftId) {
      payload.id = activeDraftId
      if (versionRef.current !== null) {
        payload.version = versionRef.current
      }
    }
    const enabledSet = new Set(enabledChannels)

    // Include enabled socials that have content/media.
    enabledChannels.forEach(channel => {
      const draft = postDrafts[channel]
      if (!hasDraftContent(draft)) return

      payload.posts.push({
        ...(draft?.id ? { id: draft.id } : {}),
        channel,
        content: draft?.content ?? '',
        attached_media: draft?.attached_media?.map(m => ({ url: m.url })),
      })
    })

    // For disabled socials, clear on BE when draft exists and we have data.
    if (activeDraftId) {
      SOCIAL_PLATFORM.forEach(({ name }) => {
        const channel = name as channelType
        if (enabledSet.has(channel)) return
        const draft = postDrafts[channel]
        if (!draft?.id && !hasDraftContent(draft)) return
        payload.posts.push({
          ...(draft?.id ? { id: draft.id } : {}),
          channel,
          content: '',
          attached_media: [],
        })
      })
    }

    return payload
  }, [draftName, enabledChannels, postDrafts])

  const buildPayloadRef = useRef(buildPayload)
  buildPayloadRef.current = buildPayload

  // ─── Mutations ─────────────────────────────────────────────────────────────

  const saveMutation = useMutation({
    mutationFn: ({ payload }: { payload: IDraftRequest }) =>
      draftsApi.postDraft(payload),
  })

  const renameMutation = useMutation({
    mutationFn: ({ name }: { name: string }) =>
      draftsApi.renameDraft({ id: draftId as string, name }),
    onSuccess: res => {
      versionRef.current = res.data.draft.version
      toast.success('Draft renamed')
    },
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
        // Update version from server response
        versionRef.current = saved.version
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
          to: '/creation/create',
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
      } catch (err) {
        setSaveStatus('idle')

        const apiErr = err as ApiError
        if (apiErr.status === API_CONSTANTS.statusCode.notFound) {
          // Draft was deleted server-side — stop all auto-save retries.
          isDirtyRef.current = false
          queuedSaveSourceRef.current = null
          toast.error('This draft no longer exists. It may have been deleted.')
        } else if (apiErr.status === API_CONSTANTS.statusCode.conflict) {
          // Handle 409 conflict: re-fetch draft to get latest version
          hydratedDraftIdRef.current = null
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.draft, activeDraftIdRef.current],
          })
        } else if (source === 'manual') {
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
    if (!isDirtyRef.current) return
    // Skip auto-save when read-only (lock not acquired)
    if (isReadOnly) return

    if (!hasContent) {
      clearAutoSaveTimer()
      setSaveStatus('idle')
      return
    }

    clearAutoSaveTimer()
    setSaveStatus('pending')

    autoSaveTimerRef.current = setTimeout(() => {
      requestSave('auto')
    }, AUTO_SAVE_DELAY_MS)

    return () => clearAutoSaveTimer()
  }, [
    clearAutoSaveTimer,
    enabledChannels,
    hasContent,
    isReadOnly,
    postDrafts,
    requestSave,
  ])

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
      if (draftId) {
        renameMutation.mutate({ name })
      }
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
    isLocked,
    isReadOnly,
    lockedByUser,
    version: versionRef.current,
    hasContent,
    hasExceededCharLimit,
    enabledChannels,
    handleContentChange,
    handleImagesChange,
    setChannelEnabled,
    handleSaveDraft,
    handleRenameDraft,
  }
}

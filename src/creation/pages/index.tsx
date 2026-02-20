import { useMutation } from '@tanstack/react-query'
import { createLazyRoute } from '@tanstack/react-router'
import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { draftsApi } from '@/core/api/drafts.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { queryClient } from '@/core/config/global.config'
import { useAppDispatch, useAppSelector } from '@/core/hooks/global-state.hook'
import { creationTabsActions } from '@/core/store/creation-tabs-slice'
import CreationTabsBar from '@/creation/components/creation-tabs-bar'
import { CreationTabId } from '@/creation/models/creation-tab.model'

const CreationPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const location = useRouterState({ select: s => s.location })
  const { activeTabId, hasUntitled, savedDrafts } = useAppSelector(
    s => s.creationTabsState
  )

  const pathname = location.pathname
  const draftId =
    pathname === '/creation/create' &&
    typeof (location.search as { draftId?: unknown })?.draftId === 'string'
      ? ((location.search as { draftId?: string }).draftId ?? undefined)
      : undefined

  useEffect(() => {
    if (pathname === '/creation') {
      dispatch(creationTabsActions.openHome())
      return
    }

    if (pathname === '/creation/create') {
      if (draftId) {
        dispatch(creationTabsActions.openSavedDraft({ id: draftId }))
        return
      }

      dispatch(creationTabsActions.openUntitled())
    }
  }, [dispatch, pathname, draftId])

  const focusTab = (tabId: CreationTabId) => {
    if (tabId === 'home') {
      dispatch(creationTabsActions.openHome())
      navigate({ to: '/creation' })
      return
    }

    if (tabId === 'untitled') {
      dispatch(creationTabsActions.openUntitled())
      navigate({ to: '/creation/create' })
      return
    }

    const targetDraftId = tabId.replace('draft:', '')
    dispatch(creationTabsActions.openSavedDraft({ id: targetDraftId }))
    navigate({ to: '/creation/create', search: { draftId: targetDraftId } })
  }

  const handleCloseSavedDraft = (draftIdToClose: string) => {
    const closingTabId = `draft:${draftIdToClose}` as CreationTabId
    const order: CreationTabId[] = [
      'home',
      ...(hasUntitled ? (['untitled'] as CreationTabId[]) : []),
      ...savedDrafts.map(d => `draft:${d.id}` as CreationTabId),
    ]

    const closingIndex = order.findIndex(id => id === closingTabId)
    const nextActive =
      closingIndex <= 0 ? 'home' : (order[closingIndex - 1] ?? 'home')

    dispatch(creationTabsActions.closeTab(closingTabId))

    if (activeTabId === closingTabId) {
      focusTab(nextActive)
    }
  }

  const handleCloseUntitled = () => {
    dispatch(creationTabsActions.closeTab('untitled'))
    focusTab('home')
  }

  const renameMutation = useMutation({
    mutationFn: (payload: { id: string; name: string }) =>
      draftsApi.renameDraft({
        id: payload.id,
        name: payload.name,
      }),
    onSuccess: (response, variables) => {
      dispatch(
        creationTabsActions.renameSavedDraft({
          id: variables.id,
          name: variables.name,
        })
      )
      queryClient.setQueryData(
        [QUERY_KEYS.draft, variables.id],
        response.data.draft
      )
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.drafts] })
      toast.success('Draft renamed')
    },
    onError: () => {
      toast.error('Failed to rename draft')
    },
  })

  return (
    <>
      <CreationTabsBar
        activeTabId={activeTabId}
        hasUntitled={hasUntitled}
        savedDrafts={savedDrafts}
        onHomeClick={() => focusTab('home')}
        onUntitledClick={() => focusTab('untitled')}
        onCloseUntitled={handleCloseUntitled}
        onSavedDraftClick={draftId => focusTab(`draft:${draftId}`)}
        onCloseSavedDraft={handleCloseSavedDraft}
        onRenameSavedDraft={(draftId, name) =>
          renameMutation.mutate({ id: draftId, name })
        }
        isRenaming={renameMutation.isPending}
        onOpenNew={() => focusTab('untitled')}
      />
      <Outlet />
    </>
  )
}

export const Route = createLazyRoute('/creation')({
  component: CreationPage,
})

export default CreationPage

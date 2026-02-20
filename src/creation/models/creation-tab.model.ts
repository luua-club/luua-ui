export type CreationTabId = 'home' | 'untitled' | `draft:${string}`

export interface CreationSavedDraftTab {
  id: string
  name: string
}

export interface CreationWorkspaceState {
  savedDrafts: CreationSavedDraftTab[]
  hasUntitled: boolean
  activeTabId: CreationTabId
}

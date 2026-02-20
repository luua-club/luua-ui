import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  CreationTabId,
  CreationWorkspaceState,
} from '@/creation/models/creation-tab.model'

const initialState: CreationWorkspaceState = {
  savedDrafts: [],
  hasUntitled: false,
  activeTabId: 'home',
}

const creationTabsSlice = createSlice({
  name: 'creationTabs',
  initialState,
  reducers: {
    openHome: state => {
      state.activeTabId = 'home'
    },

    openUntitled: state => {
      state.hasUntitled = true
      state.activeTabId = 'untitled'
    },

    openSavedDraft: (
      state,
      action: PayloadAction<{ id: string; name?: string }>
    ) => {
      const draftId = action.payload.id
      const draftName = action.payload.name?.trim() || 'Untitled'
      const existing = state.savedDrafts.find(d => d.id === draftId)

      if (!existing) {
        state.savedDrafts.push({ id: draftId, name: draftName })
      } else {
        existing.name = draftName
      }

      state.activeTabId = `draft:${draftId}`
    },

    setActiveTab: (state, action: PayloadAction<CreationTabId>) => {
      state.activeTabId = action.payload
    },

    closeTab: (state, action: PayloadAction<CreationTabId>) => {
      const tabId = action.payload

      if (tabId === 'untitled') {
        state.hasUntitled = false
        if (state.activeTabId === 'untitled') {
          state.activeTabId = 'home'
        }
        return
      }

      if (!tabId.startsWith('draft:')) {
        return
      }

      const draftId = tabId.replace('draft:', '')
      state.savedDrafts = state.savedDrafts.filter(d => d.id !== draftId)

      if (state.activeTabId === tabId) {
        state.activeTabId = 'home'
      }
    },

    removeSavedDraft: (state, action: PayloadAction<string>) => {
      const draftId = action.payload
      state.savedDrafts = state.savedDrafts.filter(d => d.id !== draftId)

      if (state.activeTabId === `draft:${draftId}`) {
        state.activeTabId = 'home'
      }
    },

    renameSavedDraft: (
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) => {
      const existing = state.savedDrafts.find(d => d.id === action.payload.id)
      if (!existing) return

      existing.name = action.payload.name.trim() || 'Untitled'
    },
  },
})

export const creationTabsActions = creationTabsSlice.actions
export default creationTabsSlice.reducer

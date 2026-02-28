import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { LUUA_AUTH_INFO_KEY } from '@/core/config/constant'
import { AuthInfo } from '@/core/models/auth.model'
import { OrganizationDetail } from '@/core/models/org.model'
import { User } from '@/core/models/user.model'
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@/shared/utils/localstorage.util'

import { ProjectDetail } from '../models/org.model'

interface IAuthState {
  isLoading: boolean
  user: User | null
  currentOrg: OrganizationDetail | null
  currentProject: ProjectDetail | null
}

const initialState: IAuthState = {
  isLoading: true,
  user: null,
  currentOrg: null,
  currentProject: null,
}

const persistAuthInfo = (state: IAuthState) => {
  const current = getLocalStorageItem<AuthInfo>(LUUA_AUTH_INFO_KEY)
  if (!current) return
  setLocalStorageItem(LUUA_AUTH_INFO_KEY, {
    ...current,
    user: state.user ?? undefined,
    currentOrg: state.currentOrg ?? undefined,
    currentProject: state.currentProject ?? undefined,
  })
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Hydrate Redux from localStorage on app mount (no LS write). */
    hydrateFromStorage: (state, action: PayloadAction<AuthInfo>) => {
      state.user = action.payload.user ?? null
      state.currentOrg = action.payload.currentOrg ?? null
      state.currentProject = action.payload.currentProject ?? null
      state.isLoading = false
    },

    /** Set full auth info after 3-API cascade; writes full AuthInfo to LS. */
    setAuthInfo: (state, action: PayloadAction<AuthInfo>) => {
      state.user = action.payload.user ?? null
      state.currentOrg = action.payload.currentOrg ?? null
      state.currentProject = action.payload.currentProject ?? null
      state.isLoading = false
      setLocalStorageItem(LUUA_AUTH_INFO_KEY, action.payload)
    },

    /** Update just the current org (e.g. after PATCH rename). */
    updateCurrentOrg: (state, action: PayloadAction<OrganizationDetail>) => {
      state.currentOrg = action.payload
      persistAuthInfo(state)
    },

    /** Update just the current project (e.g. after social connect/disconnect). */
    updateCurrentProject: (state, action: PayloadAction<ProjectDetail>) => {
      state.currentProject = action.payload
      persistAuthInfo(state)
    },

    /** Clear all auth state (LS removal is handled by logout util). */
    clearAuth: state => {
      state.user = null
      state.currentOrg = null
      state.currentProject = null
      state.isLoading = false
    },
  },
})

export const {
  hydrateFromStorage,
  setAuthInfo,
  updateCurrentOrg,
  updateCurrentProject,
  clearAuth,
} = authSlice.actions

export default authSlice.reducer

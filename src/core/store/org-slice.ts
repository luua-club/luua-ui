import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  LUUA_SELECTED_ORG_KEY,
  LUUA_SELECTED_PROJECT_KEY,
} from '@/core/config/constant'
import { Organization, Project } from '@/core/models/org.model'
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@/shared/utils/localstorage.util'

interface IOrgState {
  organizations: Organization[]
  projects: Project[]
  selectedOrgId: string | null
  selectedProjectId: string | null
  orgPlan: 'Free' | 'Pro'
}

const initialState: IOrgState = {
  organizations: [],
  projects: [],
  selectedOrgId: getLocalStorageItem<string>(LUUA_SELECTED_ORG_KEY),
  selectedProjectId: getLocalStorageItem<string>(LUUA_SELECTED_PROJECT_KEY),
  orgPlan: 'Free',
}

const orgSlice = createSlice({
  name: 'org',
  initialState,
  reducers: {
    setOrganizations: (
      state,
      action: PayloadAction<{
        organizations: Organization[]
        projects: Project[]
      }>
    ) => {
      state.organizations = action.payload.organizations
      state.projects = action.payload.projects

      // If no org is selected or stored org is no longer valid, pick first
      const validOrg = state.organizations.find(
        o => o.id === state.selectedOrgId
      )
      if (!validOrg && state.organizations.length > 0) {
        state.selectedOrgId = state.organizations[0].id
        setLocalStorageItem(LUUA_SELECTED_ORG_KEY, state.selectedOrgId)
      }

      // Resolve project: must belong to the selected org
      const orgProjects = state.projects.filter(
        p => p.org_id === state.selectedOrgId
      )
      const validProject = orgProjects.find(
        p => p.id === state.selectedProjectId
      )
      if (!validProject) {
        state.selectedProjectId =
          orgProjects.length > 0 ? orgProjects[0].id : null
        setLocalStorageItem(LUUA_SELECTED_PROJECT_KEY, state.selectedProjectId)
      }
    },

    setSelectedOrg: (state, action: PayloadAction<string>) => {
      state.selectedOrgId = action.payload
      setLocalStorageItem(LUUA_SELECTED_ORG_KEY, action.payload)

      // Reset project to first project of new org (or null)
      const orgProjects = state.projects.filter(
        p => p.org_id === action.payload
      )
      state.selectedProjectId =
        orgProjects.length > 0 ? orgProjects[0].id : null
      setLocalStorageItem(LUUA_SELECTED_PROJECT_KEY, state.selectedProjectId)
    },

    setSelectedProject: (state, action: PayloadAction<string | null>) => {
      state.selectedProjectId = action.payload
      setLocalStorageItem(LUUA_SELECTED_PROJECT_KEY, action.payload)
    },

    setOrgPlan: (state, action: PayloadAction<'Free' | 'Pro'>) => {
      state.orgPlan = action.payload
    },

    clearOrg: state => {
      state.organizations = []
      state.projects = []
      state.selectedOrgId = null
      state.selectedProjectId = null
      state.orgPlan = 'Free'
    },
  },
})

export const {
  setOrganizations,
  setSelectedOrg,
  setSelectedProject,
  setOrgPlan,
  clearOrg,
} = orgSlice.actions
export default orgSlice.reducer

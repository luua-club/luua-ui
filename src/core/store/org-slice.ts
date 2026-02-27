import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  LUUA_SELECTED_ORG_KEY,
  LUUA_SELECTED_PROJECT_KEY,
} from '@/core/config/constant'
import { OrganizationSummary, Project } from '@/core/models/org.model'
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from '@/shared/utils/localstorage.util'

interface IOrgState {
  selectedOrgId: string | null
  selectedProjectId: string | null
}

const initialState: IOrgState = {
  selectedOrgId: getLocalStorageItem<string>(LUUA_SELECTED_ORG_KEY),
  selectedProjectId: getLocalStorageItem<string>(LUUA_SELECTED_PROJECT_KEY),
}

type ProfileSelectionPayload = {
  organizations: OrganizationSummary[]
  projects: Project[]
}

const persistSelectedOrgId = (orgId: string | null) => {
  if (orgId) {
    setLocalStorageItem(LUUA_SELECTED_ORG_KEY, orgId)
    return
  }

  removeLocalStorageItem(LUUA_SELECTED_ORG_KEY)
}

const persistSelectedProjectId = (projectId: string | null) => {
  if (projectId) {
    setLocalStorageItem(LUUA_SELECTED_PROJECT_KEY, projectId)
    return
  }

  removeLocalStorageItem(LUUA_SELECTED_PROJECT_KEY)
}

const resolveSelectedOrgId = (
  selectedOrgId: string | null,
  organizations: OrganizationSummary[]
) => {
  const hasValidOrg = organizations.some(org => org.id === selectedOrgId)
  if (hasValidOrg) return selectedOrgId

  return organizations[0]?.id ?? null
}

const resolveSelectedProjectId = (
  selectedProjectId: string | null,
  selectedOrgId: string | null,
  projects: Project[]
) => {
  if (!selectedOrgId) {
    return null
  }

  const orgProjects = projects.filter(
    project => project.org_id === selectedOrgId
  )
  const hasValidProject = orgProjects.some(
    project => project.id === selectedProjectId
  )
  if (hasValidProject) return selectedProjectId

  return orgProjects[0]?.id ?? null
}

const orgSlice = createSlice({
  name: 'org',
  initialState,
  reducers: {
    syncSelectionFromProfile: (
      state,
      action: PayloadAction<ProfileSelectionPayload>
    ) => {
      const nextSelectedOrgId = resolveSelectedOrgId(
        state.selectedOrgId,
        action.payload.organizations
      )
      state.selectedOrgId = nextSelectedOrgId
      persistSelectedOrgId(nextSelectedOrgId)

      const nextSelectedProjectId = resolveSelectedProjectId(
        state.selectedProjectId,
        nextSelectedOrgId,
        action.payload.projects
      )
      state.selectedProjectId = nextSelectedProjectId
      persistSelectedProjectId(nextSelectedProjectId)
    },

    setSelectedOrg: (
      state,
      action: PayloadAction<{ orgId: string; projects: Project[] }>
    ) => {
      state.selectedOrgId = action.payload.orgId
      persistSelectedOrgId(action.payload.orgId)

      const nextSelectedProjectId = resolveSelectedProjectId(
        state.selectedProjectId,
        action.payload.orgId,
        action.payload.projects
      )
      state.selectedProjectId = nextSelectedProjectId
      persistSelectedProjectId(nextSelectedProjectId)
    },

    setSelectedProject: (state, action: PayloadAction<string | null>) => {
      state.selectedProjectId = action.payload
      persistSelectedProjectId(action.payload)
    },

    clearOrg: state => {
      state.selectedOrgId = null
      state.selectedProjectId = null
      removeLocalStorageItem(LUUA_SELECTED_ORG_KEY)
      removeLocalStorageItem(LUUA_SELECTED_PROJECT_KEY)
    },
  },
})

export const {
  syncSelectionFromProfile,
  setSelectedOrg,
  setSelectedProject,
  clearOrg,
} = orgSlice.actions
export default orgSlice.reducer

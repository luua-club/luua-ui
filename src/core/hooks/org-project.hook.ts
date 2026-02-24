import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'

import { QUERY_KEYS } from '@/core/config/constant'
import { setSelectedOrg, setSelectedProject } from '@/core/store/org-slice'

import { useAppDispatch, useAppSelector } from './global-state.hook'

export const useOrgProject = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { organizations, projects, selectedOrgId, selectedProjectId, orgPlan } =
    useAppSelector(state => state.orgState)

  const selectedOrg = useMemo(
    () => organizations.find(o => o.id === selectedOrgId) ?? null,
    [organizations, selectedOrgId]
  )

  const orgProjects = useMemo(
    () => projects.filter(p => p.org_id === selectedOrgId),
    [projects, selectedOrgId]
  )

  const selectedProject = useMemo(
    () => orgProjects.find(p => p.id === selectedProjectId) ?? null,
    [orgProjects, selectedProjectId]
  )

  const invalidateAllQueries = () => {
    // Invalidate all queries except the user profile (it doesn't depend on org/project)
    queryClient.invalidateQueries({
      predicate: query => query.queryKey[0] !== QUERY_KEYS.user,
    })
  }

  const changeOrg = (orgId: string) => {
    dispatch(setSelectedOrg(orgId))
    invalidateAllQueries()
  }

  const changeProject = (projectId: string) => {
    dispatch(setSelectedProject(projectId))
    invalidateAllQueries()
  }

  return {
    organizations,
    projects: orgProjects,
    selectedOrg,
    selectedProject,
    selectedOrgId,
    selectedProjectId,
    orgPlan,
    changeOrg,
    changeProject,
  }
}

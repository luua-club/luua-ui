import { useQuery } from '@tanstack/react-query'

import { projectApi } from '@/core/api/project.api'
import { QUERY_KEYS } from '@/core/config/constant'

export const useProjectDetail = () => {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.projectDetails],
    queryFn: () => projectApi.getProjectDetails(),
  })

  const projectDetail = data?.data ?? null
  const connectedChannels = projectDetail?.connected_channels ?? null

  return {
    projectDetail,
    connectedChannels,
    isLoading,
  }
}

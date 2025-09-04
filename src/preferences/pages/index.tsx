import { useQuery } from '@tanstack/react-query'
import { createLazyRoute } from '@tanstack/react-router'
import { Frown } from 'lucide-react'

import { userApi } from '@/core/api/user.api'
import { QUERY_KEYS, UserStyleStatus } from '@/core/config/constant'
import UserStyles from '@/core/containers/UserStyles'
import Summary from '@/preferences/container/Summary'

import Advanced from '../container/Advanced'

const Preferences = () => {
  const { data, isLoading, isPending, isError } = useQuery({
    queryKey: [QUERY_KEYS.userStyle],
    queryFn: () => userApi.getUserStyle(),
    refetchOnMount: true,
  })

  if (isError) {
    return (
      <div className="m-auto flex min-h-16 max-w-4xl items-center justify-center rounded-lg border-1 border-dashed p-4">
        <Frown className="mr-2 size-4" />
        Something went wrong, Please try again later
      </div>
    )
  }

  return (
    <div className="m-auto flex max-w-4xl flex-col p-5">
      <Summary data={data?.data} isLoading={isLoading} />
      {data?.data.style_gen_state !== UserStyleStatus.IN_PROGRESS && (
        <div className="mt-4">
          <Advanced data={data?.data} />
        </div>
      )}
      <div className="mt-4">
        <UserStyles data={data?.data} isLoading={isLoading || isPending} />
      </div>
    </div>
  )
}

export const Route = createLazyRoute('/preferences')({
  component: Preferences,
})

export default Preferences

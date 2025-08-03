import { Clock, Lightbulb } from 'lucide-react'

import {
  userStyleResponseType,
  UserStyleStatus,
} from '@/core/models/user.model'
import { Skeleton } from '@/shared/ui/skeleton'

interface ISummaryProps {
  data?: userStyleResponseType
  isLoading: boolean
}

const Summary = ({ data, isLoading }: ISummaryProps) => {
  if (!data || isLoading)
    return (
      <>
        <div className="py-4">
          <h1 className="text-lg font-medium">Analysis Summary</h1>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-20 w-full rounded-md" />
          <Skeleton className="h-20 w-full rounded-md" />
        </div>
      </>
    )

  const sources = data.source_count ?? 0
  const characters = data.source_length ?? 0
  const styles = data.style_tags ?? []
  const status = data.style_gen_state

  if (
    (sources === 0 && characters === 0 && styles.length === 0) ||
    status === UserStyleStatus.INITIAL
  )
    return (
      <div className="flex min-h-16 items-center justify-center rounded-lg border-1 border-dashed p-4">
        <p className="flex items-center gap-1 text-center text-base font-medium">
          {status === UserStyleStatus.IN_PROGRESS ? (
            <>
              <Clock className="size-4" />
              Luua is currently analyzing your writing style. This may take some
              time.
            </>
          ) : (
            <>
              <Lightbulb className="size-4" />
              Help Luua understand your writing style by providing some sample
              or inspiration.
            </>
          )}
        </p>
      </div>
    )

  return (
    <>
      <div className="py-4">
        <h1 className="text-lg font-medium">Analysis Summary</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="border-sidebar-border bg-sidebar rounded-lg border-1 p-4">
          <p className="text-sm font-semibold">Sources Analyzed</p>
          <p className="text-lg font-medium text-gray-600">{sources}</p>
        </div>
        <div className="border-sidebar-border bg-sidebar rounded-lg border-1 p-4">
          <p className="text-sm font-semibold">Total Characters</p>
          <p className="truncate text-lg font-medium text-gray-600">
            {characters}
          </p>
        </div>
      </div>

      {styles.length ? (
        <>
          <p className="py-4 text-base font-medium">Style Profile</p>
          <div className="flex flex-wrap gap-2">
            {styles.map(style => (
              <p
                className="rounded-md border-1 px-4 py-2 text-sm font-medium"
                key={style}
              >
                {style}
              </p>
            ))}
          </div>
        </>
      ) : null}
    </>
  )
}

export default Summary

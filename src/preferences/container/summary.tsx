import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

import { userApi } from '@/core/api/user.api'
import { QUERY_KEYS, UserStyleStatus } from '@/core/config/constant'
import { userStyleResponseType } from '@/core/models/user.model'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { cn } from '@/shared/utils'

interface ISummaryProps {
  data?: userStyleResponseType
  onHelperTextClick: () => void
  isLoading: boolean
}

const Summary = ({ data, isLoading, onHelperTextClick }: ISummaryProps) => {
  // --- Hooks ---
  const queryClient = useQueryClient()
  const resetUserStyle = useMutation({
    mutationFn: () => userApi.resetUserStyle(),
    onSuccess: () => {
      toast.success('User style reset successfully')
    },
    onError: () => {
      toast.error('Failed to reset user style')
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.userStyle],
      })
    },
  })

  // --- Early return ---
  if (!data || isLoading || resetUserStyle.isPending) {
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
  }

  // --- Variables ---
  const sources = data.source_count ?? 0
  const characters = data.source_length ?? 0
  const styles = data.style_tags ?? []
  const status = data.style_gen_state

  // --- Functions ---
  /**
   * Returns the stat value with loading or failed icon
   *
   * @param stat - The stat value
   * @returns The stat value with loading or failed icon
   */
  const getStat = (stat: number) => {
    return (
      <p className="text-card-foreground text-xl font-bold">
        {status === UserStyleStatus.IN_PROGRESS ? (
          <Loader className="mt-2 size-4 animate-spin" />
        ) : status === UserStyleStatus.FAILED ? (
          <X className="mt-2 size-4 text-red-400" />
        ) : (
          stat
        )}
      </p>
    )
  }

  return (
    <>
      {/* Heading */}
      <div className="flex items-center justify-between py-4">
        <h1 className="text-lg font-medium">Analysis Summary</h1>
        <Button
          variant="outline"
          className="h-7 rounded-sm text-xs text-red-600 dark:text-red-400"
          onClick={() => resetUserStyle.mutate()}
        >
          <Trash2 /> Reset Styles
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Stat: Sources Analyzed */}
        <div
          className={cn(
            'border-sidebar-border bg-sidebar rounded-lg border-1 p-4',
            {
              'opacity-50': status === UserStyleStatus.INITIAL,
            }
          )}
        >
          <p className="text-sm font-semibold">Sources Analyzed</p>
          {getStat(sources)}
        </div>

        {/* Stat: Total Characters */}
        <div
          className={cn(
            'border-sidebar-border bg-sidebar rounded-lg border-1 p-4',
            {
              'opacity-50': status === UserStyleStatus.INITIAL,
            }
          )}
        >
          <p className="text-sm font-semibold">Total Characters</p>
          {getStat(characters)}
        </div>
      </div>

      {/* Styles chips */}
      {styles.length ? (
        <>
          <p className="py-4 text-sm font-semibold">Styles Profile</p>
          <div className="flex flex-wrap gap-2">
            {styles.map(style => (
              <p
                className="border-sidebar-border bg-sidebar text-card-foreground rounded-md border-1 px-4 py-2 text-sm font-semibold"
                key={style}
              >
                {style}
              </p>
            ))}
          </div>
        </>
      ) : null}

      {/* INITIAL Helper text */}
      {status === UserStyleStatus.INITIAL && (
        <div className="pt-4 text-center text-sm font-medium">
          Help Luua understand your writing style by providing
          <span
            className="ml-1 cursor-pointer underline"
            onClick={onHelperTextClick}
          >
            some sample or inspiration.
          </span>
        </div>
      )}

      {/* IN_PROGRESS Helper text */}
      {status === UserStyleStatus.IN_PROGRESS && (
        <div className="bg flex items-center justify-center gap-1 pt-4 text-sm font-medium text-yellow-600 dark:text-yellow-400">
          Luua is currently analyzing your writing style. This may take some
          time.
        </div>
      )}

      {/* FAILED Helper text */}
      {status === UserStyleStatus.FAILED && (
        <div className="pt-4 text-center text-sm font-medium text-red-600 dark:text-red-400">
          Failed to analyze your writing style.
          <span
            className="ml-1 cursor-pointer underline"
            onClick={onHelperTextClick}
          >
            Please try again.
          </span>
        </div>
      )}
    </>
  )
}

export default Summary

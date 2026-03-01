import { useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { AlertCircle, ArrowRight, Loader2 } from 'lucide-react'
import { Suspense } from 'react'

import { userApi } from '@/core/api/user.api'
import { QUERY_KEYS, UserStyleStatus } from '@/core/config/constant'
import { writingStyles } from '@/core/config/user-preferences.config'
import { userStyleResponseType } from '@/core/models/user.model'
import { WritingStyleChip } from '@/shared/models/style-chip.model'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { cn } from '@/shared/utils'

const getStrength = (chars: number) => {
  if (chars < 500)
    return {
      level: 'Low',
      color:
        'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
    }
  if (chars >= 1000)
    return {
      level: 'Good',
      color:
        'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
    }
  return {
    level: 'Medium',
    color:
      'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800',
  }
}

const EmptyState = ({ onNavigate }: { onNavigate: () => void }) => (
  <div className="flex flex-col gap-3 p-1">
    <div className="flex flex-col gap-0.5">
      <p className="text-xs font-medium">Writing Style</p>
      <p className="text-muted-foreground text-[11px] leading-snug">
        Help AI write like you — define your voice.
      </p>
    </div>

    <div className="flex gap-1.5">
      {writingStyles.map(s => {
        const Icon = s.icon
        return (
          <div
            key={s.id}
            className={cn(
              'flex size-6 items-center justify-center rounded-full',
              s.color
            )}
            title={s.title}
          >
            <Icon className="size-3" />
          </div>
        )
      })}
    </div>

    <Button
      variant="default"
      className="dark:bg-brand-accent-yellow !h-7 w-full text-xs dark:font-semibold"
      onClick={onNavigate}
    >
      Set up styles <ArrowRight className="size-3" />
    </Button>
  </div>
)

const ActiveState = ({
  data,
  selectedChips,
  onNavigate,
}: {
  data: userStyleResponseType
  selectedChips: WritingStyleChip[]
  onNavigate: () => void
}) => {
  const chars = data.source_length ?? 0
  const strength = getStrength(chars)
  const hasVoiceTraining = data.style_gen_state === UserStyleStatus.GENERATED
  const showNudge = hasVoiceTraining && strength.level !== 'Good'

  return (
    <div className="flex flex-col gap-2.5 p-1">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium">Writing Style</p>
        {hasVoiceTraining && (
          <span
            className={cn(
              'inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium',
              strength.color
            )}
          >
            {strength.level}
          </span>
        )}
      </div>

      {selectedChips.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {selectedChips.slice(0, 2).map(style => {
            const Icon = style.icon
            return (
              <div key={style.id} className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-md',
                    style.color
                  )}
                >
                  <Icon className="text-foreground/70 size-3" />
                </div>
                <p className="text-xs font-medium">{style.title}</p>
              </div>
            )
          })}
          {selectedChips.length > 2 && (
            <p className="text-muted-foreground text-[10px]">
              +{selectedChips.length - 2} more
            </p>
          )}
        </div>
      )}

      {!hasVoiceTraining && (
        <p className="text-muted-foreground text-[10px] leading-snug">
          Train your voice for better results.
        </p>
      )}

      {showNudge && (
        <p className="text-muted-foreground text-[10px] leading-snug">
          {strength.level === 'Low'
            ? 'Add content or sources to improve your style quality.'
            : 'Consider adding more sources for better quality.'}
        </p>
      )}

      <Button
        variant="outline"
        className="!h-7 w-full text-xs"
        onClick={onNavigate}
      >
        Manage styles <ArrowRight className="size-3" />
      </Button>
    </div>
  )
}

const InProgressState = ({ onNavigate }: { onNavigate: () => void }) => (
  <div className="flex flex-col items-center gap-2 py-1 text-center">
    <Loader2 className="text-muted-foreground size-4 animate-spin" />
    <div className="flex flex-col gap-0.5">
      <p className="text-xs font-medium">Analyzing your voice…</p>
      <p className="text-muted-foreground text-[10px]">
        This may take a moment
      </p>
    </div>
    <Button variant="ghost" className="!h-6 text-[10px]" onClick={onNavigate}>
      View progress
    </Button>
  </div>
)

const FailedState = ({ onNavigate }: { onNavigate: () => void }) => (
  <div className="flex flex-col items-center gap-2 py-1 text-center">
    <AlertCircle className="size-4 text-red-500" />
    <p className="text-xs font-medium">Style generation failed</p>
    <Button
      variant="outline"
      className="!h-7 text-xs text-red-600 dark:text-red-400"
      onClick={onNavigate}
    >
      Try again <ArrowRight className="size-3" />
    </Button>
  </div>
)

const StylesSkeleton = () => (
  <div className="flex flex-col gap-2 p-1">
    <Skeleton className="h-3 w-20" />
    <Skeleton className="h-3 w-32" />
    <div className="flex gap-1.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="size-4 rounded-full" />
      ))}
    </div>
    <Skeleton className="h-7 w-full rounded-md" />
  </div>
)

const StylesInner = () => {
  const router = useRouter()
  const { data: response } = useSuspenseQuery({
    queryKey: [QUERY_KEYS.userStyle],
    queryFn: () => userApi.getUserStyle(),
  })

  const navigate = () => router.navigate({ to: '/preferences' })

  const data = response.data
  const state = data?.style_gen_state

  // writing_style is string[] at runtime (zod transform doesn't run without .parse())
  const rawIds = (data?.writing_style as unknown as string[]) ?? []
  const selectedChips = rawIds
    .map(id => writingStyles.find(s => s.id === id))
    .filter((s): s is WritingStyleChip => s !== undefined)

  if (!selectedChips.length && state === UserStyleStatus.INITIAL) {
    return <EmptyState onNavigate={navigate} />
  }
  if (state === UserStyleStatus.IN_PROGRESS) {
    return <InProgressState onNavigate={navigate} />
  }
  if (state === UserStyleStatus.FAILED) {
    return <FailedState onNavigate={navigate} />
  }

  return (
    <ActiveState
      data={data}
      selectedChips={selectedChips}
      onNavigate={navigate}
    />
  )
}

export const StylesContent = () => (
  <Suspense fallback={<StylesSkeleton />}>
    <StylesInner />
  </Suspense>
)

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLazyRoute } from '@tanstack/react-router'
import { Network, Settings2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import InspirationSettingsModal from '@/auto-gen/container/InspirationSettingsModal'
import { autopilotApi } from '@/core/api/autopilot.api'
import { QUERY_KEYS } from '@/core/config/constant'
import type { AutopilotSettings } from '@/core/models/autopilot.model'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { Switch } from '@/shared/ui/switch'
import { cn } from '@/shared/utils'

function Inspiration() {
  // --- State ---
  const [checked, setChecked] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // --- Hooks ---
  /**
   * Fetch current autopilot settings
   */
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.autopilotSettings],
    queryFn: (): Promise<AutopilotSettings> =>
      autopilotApi.getAutoPilotSettings().then(res => res.data),
  })

  // --- Effects ---
  /**
   * Initialize the toggle based on API response
   */
  useEffect(() => {
    if (data?.enabled !== undefined) {
      setChecked(Boolean(data.enabled))
    }
  }, [data?.enabled])

  return (
    <div className="m-auto max-w-4xl p-5">
      <div className="mb-2 flex items-center justify-between gap-8">
        {/* Header */}
        <h1 className="flex items-center gap-3 text-base font-medium">
          <Network className="size-5" />
          Auto Generation
        </h1>

        {/* Actions */}
        <MainActions
          checked={checked}
          setChecked={setChecked}
          setIsSettingsOpen={setIsSettingsOpen}
          isLoading={isLoading}
        />
      </div>

      {/* Separator */}
      <Separator />

      {/* Description */}
      <p className="text-muted-foreground mt-4">
        Save any article, video, or link as inspiration and set your preferred
        posting frequency. Luua will automatically turn your inspirations into
        ready-to-use posts, scheduled at the best times for your timezone.
      </p>

      {/* Settings Modal */}
      <InspirationSettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        defaultBasePrompt={data?.base_prompt}
        defaultFrequencyDays={data?.frequency_days}
        defaultChannels={data?.channels}
      />
    </div>
  )
}

interface MainActionsProps {
  checked: boolean
  setChecked: (checked: boolean) => void
  setIsSettingsOpen: (open: boolean) => void
  isLoading: boolean
}

const MainActions = ({
  checked,
  setChecked,
  setIsSettingsOpen,
  isLoading,
}: MainActionsProps) => {
  // --- Hooks ---
  const queryClient = useQueryClient()

  /**
   * Enable/Disable auto-gen
   */
  const updateSettingsMutation = useMutation({
    mutationFn: (payload: Partial<AutopilotSettings>) =>
      autopilotApi.updateAutoPilotSettings(payload),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.autopilotSettings],
      })
      toast.success(
        `Auto generation ${variables.enabled ? 'enabled' : 'disabled'}`
      )
    },
    onError: () => {
      toast.error('Something went wrong!')
    },
  })

  return (
    <div className="flex items-center gap-3">
      {/* Edit button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsSettingsOpen(true)}
        aria-label="Open auto generation settings"
        className="!text-sm"
        disabled={!checked}
      >
        <Settings2 className="size-3.5" />
        Edit
      </Button>

      {/* Separator */}
      <Separator orientation="vertical" className="!h-6" />

      {/* Toggle */}
      <div className="text-muted-foreground flex items-center gap-2">
        <span className={cn('text-sm font-medium', checked && 'text-primary')}>
          {checked ? 'Enabled' : 'Disabled'}
        </span>

        <Switch
          className="cursor-pointer"
          checked={checked}
          disabled={isLoading || updateSettingsMutation.isPending}
          onCheckedChange={next => {
            // Optimistic update
            setChecked(next)
            updateSettingsMutation.mutate(
              { enabled: next },
              {
                onError: () => {
                  // Rollback UI on error
                  setChecked(!next)
                },
              }
            )
          }}
        />
      </div>
    </div>
  )
}

export const Route = createLazyRoute('/auto-gen/inspiration')({
  component: Inspiration,
})

export default Inspiration

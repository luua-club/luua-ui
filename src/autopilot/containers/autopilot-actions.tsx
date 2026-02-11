import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { Box, CircleAlert, Loader, Play, Settings2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { autopilotApi } from '@/core/api/autopilot.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { useUserState } from '@/core/hooks/user-state.hook'
import { AutopilotSettings } from '@/core/models/autopilot.model'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { Switch } from '@/shared/ui/switch'
import { cn } from '@/shared/utils'

import TriggerAutopilotModal from './trigger-autopilot-modal'

interface AutopilotActions {
  checked: boolean
  setChecked: (checked: boolean) => void
  setIsSettingsOpen: (open: boolean) => void
  isLoading: boolean
  limitReached: boolean
}

function AutopilotActions({
  checked,
  setChecked,
  setIsSettingsOpen,
  isLoading,
  limitReached,
}: AutopilotActions) {
  // --- Hooks ---
  const queryClient = useQueryClient()
  const user = useUserState()
  const router = useRouter()
  const [isTriggerModalOpen, setIsTriggerModalOpen] = useState(false)

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
      toast.success(`Autopilot ${variables.enabled ? 'enabled' : 'disabled'}`)
    },
    onError: () => {
      toast.error('Something went wrong!')
    },
  })

  const getPayload = (enabled: boolean) => {
    const payload: Partial<AutopilotSettings> = {
      enabled,
    }

    if (enabled) {
      payload.frequency_days = 5
      payload.channels =
        user?.plan === 'Pro' ? ['Twitter', 'LinkedIn'] : ['LinkedIn']
    }

    return payload
  }

  if (!user) {
    return <Loader className="size-4 animate-spin" />
  }

  if (limitReached && !isLoading) {
    return (
      <div className="flex items-center gap-2">
        <p className="text-destructive flex items-center gap-1 text-xs font-bold">
          <CircleAlert className="size-3.5" /> Limit Reached
        </p>
        <Button
          onClick={() => router.navigate({ to: '/payments' })}
          size="sm"
          className="text-xs"
        >
          <Box className="size-3.5" />
          Upgrade Plan
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center gap-3">
        {/* Trigger Now button - only visible when enabled and limit not reached */}
        {checked && !limitReached && (
          <>
            <Button
              type="button"
              size="sm"
              onClick={() => setIsTriggerModalOpen(true)}
              className="!text-sm"
              disabled={isLoading || updateSettingsMutation.isPending}
            >
              <Play className="size-3.5" />
              Trigger Now
            </Button>
            <Separator orientation="vertical" className="!h-6" />
          </>
        )}

        {/* Edit button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsSettingsOpen(true)}
          className="!text-sm"
          disabled={!checked || isLoading || updateSettingsMutation.isPending}
        >
          <Settings2 className="size-3.5" />
          Edit
        </Button>

        {/* Separator */}
        <Separator orientation="vertical" className="!h-6" />

        {/* Toggle */}
        <div className="text-muted-foreground flex items-center gap-2">
          <span
            className={cn('text-sm font-medium', checked && 'text-primary')}
          >
            {checked ? 'Enabled' : 'Disabled'}
          </span>

          {isLoading || updateSettingsMutation.isPending ? (
            <Loader className="size-4 animate-spin" />
          ) : (
            <Switch
              className="cursor-pointer"
              checked={checked}
              onCheckedChange={next => {
                // Optimistic update
                setChecked(next)
                updateSettingsMutation.mutate(getPayload(next), {
                  onError: () => {
                    // Rollback UI on error
                    setChecked(!next)
                  },
                })
              }}
            />
          )}
        </div>
      </div>

      {/* Trigger Autopilot Modal */}
      <TriggerAutopilotModal
        open={isTriggerModalOpen}
        onOpenChange={setIsTriggerModalOpen}
      />
    </>
  )
}

export default AutopilotActions

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { Box, Loader, Settings2 } from 'lucide-react'
import { toast } from 'sonner'

import { autopilotApi } from '@/core/api/autopilot.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { useUserState } from '@/core/hooks/user-state.hook'
import { AutopilotSettings } from '@/core/models/autopilot.model'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { Switch } from '@/shared/ui/switch'
import { cn } from '@/shared/utils'

interface AutoGenActionsProps {
  checked: boolean
  setChecked: (checked: boolean) => void
  setIsSettingsOpen: (open: boolean) => void
  isLoading: boolean
}

function AutoGenActions({
  checked,
  setChecked,
  setIsSettingsOpen,
  isLoading,
}: AutoGenActionsProps) {
  // --- Hooks ---
  const queryClient = useQueryClient()
  const user = useUserState()
  const router = useRouter()

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

  const getPayload = (enabled: boolean) => {
    const payload: Partial<AutopilotSettings> = {
      enabled,
    }

    if (enabled) {
      payload.frequency_days = 5
      payload.channels = ['Twitter', 'LinkedIn']
    }

    return payload
  }

  if (!user) {
    return <Loader className="size-4 animate-spin" />
  }

  if (user.plan === 'Free') {
    return (
      <Button
        onClick={() => router.navigate({ to: '/payments' })}
        size="sm"
        className="text-xs"
      >
        <Box className="size-3.5" />
        Upgrade Plan
      </Button>
    )
  }

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
            updateSettingsMutation.mutate(getPayload(next), {
              onError: () => {
                // Rollback UI on error
                setChecked(!next)
              },
            })
          }}
        />
      </div>
    </div>
  )
}

export default AutoGenActions

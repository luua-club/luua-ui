import { useQuery } from '@tanstack/react-query'
import { createLazyRoute, Link } from '@tanstack/react-router'
import { Network } from 'lucide-react'
import { useEffect, useState } from 'react'

import { autopilotApi } from '@/core/api/autopilot.api'
import { paymentApi } from '@/core/api/payment.api'
import { QUERY_KEYS } from '@/core/config/constant'
import Drafts from '@/core/containers/Drafts'
import { AutopilotSettings } from '@/core/models/autopilot.model'
import { IUsageSummary } from '@/core/models/payment.model'
import { Separator } from '@/shared/ui/separator'

import AutopilotActions from './containers/autopilot-actions'
import AutopilotSettingsModal from './containers/autopilot-settings-modal'

function AutoPilot() {
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

  /**
   * Fetch usage summary
   */
  const { data: usageSummary, isLoading: isUsageSummaryLoading } = useQuery({
    queryKey: [QUERY_KEYS.usageSummary],
    queryFn: () => paymentApi.getUsage(),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
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

  /**
   * Check if the auto pilot posts limit is reached
   *
   * @param usageSummary - The usage summary
   * @returns True if the limit is reached, false otherwise
   */
  const limitReached = (usageSummary: IUsageSummary | undefined) => {
    if (!usageSummary) {
      return false
    }

    if (usageSummary.limits.auto_pilot_posts.total === -1) {
      return false
    }

    return (
      usageSummary.limits.auto_pilot_posts.used >=
      usageSummary.limits.auto_pilot_posts.total
    )
  }

  return (
    <div className="m-auto max-w-4xl p-4">
      <div className="rounded-sm border">
        <div className="flex flex-col items-center justify-between gap-4 p-4 md:flex-row md:gap-8">
          {/* Header */}
          <h1 className="flex items-center gap-3 text-xl font-medium md:text-base">
            <Network className="size-5" />
            Auto Pilot
          </h1>

          {/* Actions */}
          <AutopilotActions
            checked={checked}
            setChecked={setChecked}
            setIsSettingsOpen={setIsSettingsOpen}
            isLoading={isLoading || isUsageSummaryLoading}
            limitReached={limitReached(usageSummary?.data?.usage_summary)}
          />
        </div>

        <Separator />

        {/* Description */}
        <p className="p-4 text-center md:text-left">
          Luua Autopilot uses your{' '}
          <Link to="/bookmarks" className="font-semibold underline">
            bookmarks
          </Link>{' '}
          to create fresh post drafts in the background, sends them to your
          email, and lets you control how frequently drafts are generated and
          which social channels they are created for.
        </p>
      </div>

      <div className="mt-8 px-2">
        <Drafts showOnlyAutoPilot />
      </div>

      {/* Settings Modal */}
      <AutopilotSettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        defaultBasePrompt={data?.base_prompt}
        defaultFrequencyDays={data?.frequency_days}
        defaultChannels={data?.channels}
      />
    </div>
  )
}

//--- Lazy Route ---
export const Route = createLazyRoute('/autopilot')({
  component: AutoPilot,
})

export default AutoPilot

import { useQuery } from '@tanstack/react-query'
import { createLazyRoute } from '@tanstack/react-router'
import { Lightbulb, Network } from 'lucide-react'
import { useEffect, useState } from 'react'

import AutoGenSettingsModal from '@/auto-gen/container/AutoGenSettingsModal'
import { autopilotApi } from '@/core/api/autopilot.api'
import { paymentApi } from '@/core/api/payment.api'
import { QUERY_KEYS } from '@/core/config/constant'
import type { AutopilotSettings } from '@/core/models/autopilot.model'
import { Separator } from '@/shared/ui/separator'

import AutoGenActions from '../container/AutoGenActions'
import InspirationsCrud from '../container/InspirationsCrud'

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

  return (
    <div className="m-auto max-w-4xl p-5">
      <div className="rounded-sm border">
        <div className="flex flex-col items-center justify-between gap-4 p-4 md:flex-row md:gap-8">
          {/* Header */}
          <h1 className="flex items-center gap-3 text-xl font-medium md:text-base">
            <Network className="size-5" />
            Auto Generation
          </h1>

          {/* Actions */}
          <AutoGenActions
            checked={checked}
            setChecked={setChecked}
            setIsSettingsOpen={setIsSettingsOpen}
            isLoading={isLoading || isUsageSummaryLoading}
            limitReached={
              (usageSummary?.data?.usage_summary.limits.auto_pilot_posts.used ||
                0) >=
              (usageSummary?.data?.usage_summary.limits.auto_pilot_posts
                .total || 0)
            }
          />
        </div>

        <Separator />

        {/* Description */}
        <p className="p-4 text-center font-medium md:text-left">
          Save any article, video, or link as inspiration and set your preferred
          posting frequency. Luua will automatically turn your inspirations into
          ready-to-use posts.
        </p>
      </div>

      {/* Header */}
      <h1 className="mt-8 flex items-center justify-center gap-3 text-xl font-medium md:justify-start md:text-base">
        <Lightbulb className="size-5" />
        Inspirations
      </h1>

      {/* Separator */}
      <Separator className="my-4" />

      {/* Inspirations CRUD */}
      <InspirationsCrud />

      {/* Settings Modal */}
      <AutoGenSettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        defaultBasePrompt={data?.base_prompt}
        defaultFrequencyDays={data?.frequency_days}
        defaultChannels={data?.channels}
      />
    </div>
  )
}

export const Route = createLazyRoute('/auto-gen/inspiration')({
  component: Inspiration,
})

export default Inspiration

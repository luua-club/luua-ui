import { useQuery } from '@tanstack/react-query'
import { createLazyRoute, Link } from '@tanstack/react-router'
import { Network } from 'lucide-react'
import { useEffect, useState } from 'react'

import AutoPilotImage from '@/assets/images/autopilot.webp'
import AutoPilotImageDark from '@/assets/images/autopilot-dark.webp'
import { autopilotApi } from '@/core/api/autopilot.api'
import { paymentApi } from '@/core/api/payment.api'
import { EXTERNAL_URLS, QUERY_KEYS } from '@/core/config/constant'
import Drafts from '@/core/containers/Drafts'
import { AutopilotSettings } from '@/core/models/autopilot.model'
import { IUsageSummary } from '@/core/models/payment.model'
import { useTheme } from '@/shared/provider/theme-provider'
import { HeroVideoDialog } from '@/shared/ui/hero-video-dialog'
import { Separator } from '@/shared/ui/separator'

import AutopilotActions from './containers/autopilot-actions'
import AutopilotSettingsModal from './containers/autopilot-settings-modal'

function AutoPilot() {
  // --- State ---
  const [checked, setChecked] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { theme } = useTheme()

  // --- Queries ---
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.autopilotSettings],
    queryFn: (): Promise<AutopilotSettings> =>
      autopilotApi.getAutoPilotSettings().then(res => res.data),
  })

  const { data: usageSummary, isLoading: isUsageSummaryLoading } = useQuery({
    queryKey: [QUERY_KEYS.usageSummary],
    queryFn: () => paymentApi.getUsage(),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  })

  // --- Effects ---
  useEffect(() => {
    if (data?.enabled !== undefined) {
      setChecked(Boolean(data.enabled))
    }
  }, [data?.enabled])

  const limitReached = (usageSummary: IUsageSummary | undefined) => {
    if (!usageSummary) return false
    if (usageSummary.limits.auto_pilot_posts.total === -1) return false

    return (
      usageSummary.limits.auto_pilot_posts.used >=
      usageSummary.limits.auto_pilot_posts.total
    )
  }

  return (
    <div className="m-auto max-w-4xl p-4">
      {/* ================= Card ================= */}
      <div className="bg-background rounded-md border">
        {/* Header */}
        <div className="flex flex-col items-center justify-between gap-4 p-4 md:flex-row">
          <h1 className="flex items-center gap-3 text-lg font-medium">
            <Network className="size-5" />
            Autopilot
          </h1>

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
        <div className="space-y-4 p-4 text-center md:text-left">
          <p className="text-sm">
            Luua Autopilot uses your{' '}
            <Link to="/bookmarks" className="font-medium underline">
              bookmarks
            </Link>{' '}
            to generate fresh post drafts in the background, sends them to your
            email, and lets you control how frequently drafts are created and
            which social channels they’re targeted for.
          </p>
        </div>

        <div className="border-t p-4">
          <div className="space-y-3">
            <p className="text-sm font-medium">New to Autopilot?</p>

            <HeroVideoDialog
              videoSrc={EXTERNAL_URLS.youtube_autopilot}
              thumbnailSrc={
                theme === 'dark' ? AutoPilotImageDark : AutoPilotImage
              }
              thumbnailAlt="How Luua Autopilot works"
              className="w-[200px]"
            />

            <p className="text-muted-foreground text-xs">
              A minute walkthrough
            </p>
          </div>
        </div>
      </div>

      {/* ================= Drafts ================= */}
      <div className="mt-12 px-2">
        <Drafts showOnlyAutoPilot />
      </div>

      {/* ================= Settings Modal ================= */}
      <AutopilotSettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        defaultBasePrompt={data?.base_prompt}
        defaultFrequencyDays={data?.frequency_days}
        defaultChannels={data?.channels}
        defaultAutoPublish={data?.auto_publish}
      />
    </div>
  )
}

// --- Lazy Route ---
export const Route = createLazyRoute('/autopilot')({
  component: AutoPilot,
})

export default AutoPilot

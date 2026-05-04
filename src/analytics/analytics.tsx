import { createLazyRoute } from '@tanstack/react-router'
import { BarChart3 } from 'lucide-react'
import { useMemo } from 'react'

import { SOCIAL_PLATFORM } from '@/core/config/constant'
import { getSocialPlatformLabel } from '@/core/utils/social.utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'

import WorkInProgress from './components/work-in-progress'
import AnalyticsSummaryLayout from './layouts/analytics-layout'

function AnalyticsPage() {
  // --- Variables ---
  const LinkedInLogo = useMemo(
    () => SOCIAL_PLATFORM.find(platform => platform.name === 'LinkedIn')?.logo,
    []
  )
  const TwitterLogo = useMemo(
    () => SOCIAL_PLATFORM.find(platform => platform.name === 'Twitter')?.logo,
    []
  )

  return (
    <div className="bg-secondary dark:bg-secondary/70 min-h-screen py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 md:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-foreground text-3xl font-semibold">
              Analytics
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Performance insights from your connected social accounts.
            </p>
          </div>
        </div>

        <Tabs defaultValue="summary" className="gap-6">
          <TabsList className="bg-foreground/3 px-1 py-1">
            <TabsTrigger
              value="summary"
              className="data-[state=active]:bg-card px-4 font-semibold"
            >
              <BarChart3 className="size-4" />
              Summary
            </TabsTrigger>
            <TabsTrigger
              value="linkedin"
              className="data-[state=active]:bg-card px-4 font-semibold"
            >
              {LinkedInLogo && <LinkedInLogo width={16} height={16} />}
              {getSocialPlatformLabel('LinkedIn')}
            </TabsTrigger>
            <TabsTrigger
              value="twitter"
              className="data-[state=active]:bg-card px-4 font-semibold"
            >
              {TwitterLogo && <TwitterLogo width={16} height={16} />}
              {getSocialPlatformLabel('Twitter')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-0 px-2">
            <AnalyticsSummaryLayout />
          </TabsContent>

          <TabsContent value="linkedin" className="mt-0 px-2">
            <WorkInProgress />
          </TabsContent>

          <TabsContent value="twitter" className="mt-0 px-2">
            <WorkInProgress />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export const Route = createLazyRoute('/analytics')({
  component: AnalyticsPage,
})

export default AnalyticsPage

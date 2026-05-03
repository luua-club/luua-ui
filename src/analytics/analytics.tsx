import { useQuery } from '@tanstack/react-query'
import { createLazyRoute } from '@tanstack/react-router'
import { BarChart3 } from 'lucide-react'
import { type ReactNode, useMemo } from 'react'

import { analyticsApi } from '@/core/api/analytics.api'
import { QUERY_KEYS, SOCIAL_PLATFORM } from '@/core/config/constant'
import { ICommonAnalyticsData } from '@/core/models/analytics.model'
import { getSocialPlatformLabel } from '@/core/utils/social.utils'
import ErrorBanner from '@/shared/components/error-banner'
import { Card, CardContent, CardHeader } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'

import ConnectedSocialsCard from './components/connected-socials-card'
import EmptyState from './components/empty-state'
import {
  LeadingChannelCard,
  PostCountByChannelCard,
  TotalEngagementCard,
} from './components/engagement-performance-card'
import SocialMetricCards, {
  SocialMetricCardsSkeleton,
} from './components/social-metric-cards'
import TopPostsTable from './components/top-posts-table'
import WorkInProgress from './components/work-in-progress'
import {
  type CommonAnalyticsSummary,
  getTotalTrendChange,
  summarizeCommonAnalytics,
} from './utils'

const LinkedInLogo = SOCIAL_PLATFORM.find(
  platform => platform.name === 'LinkedIn'
)?.logo
const TwitterLogo = SOCIAL_PLATFORM.find(
  platform => platform.name === 'Twitter'
)?.logo

function AnalyticsPage() {
  const { data, isPending, isError } = useQuery({
    queryKey: [QUERY_KEYS.analytics, 'common'],
    queryFn: () => analyticsApi.getCommonAnalytics(),
    staleTime: 15 * 60_000,
  })

  if (isError) return <ErrorBanner />
  if (!isPending && data && data.posts.length === 0) return <EmptyState />

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
          <ConnectedSocialsCard />
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
            <SummaryContent isPending={isPending} data={data} />
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

//---------------------------------
// Summarised Metrics Charts Props
//---------------------------------
interface SummarisedDataProps {
  isPending: boolean
  data?: ICommonAnalyticsData
}

interface AnalyticsSectionProps {
  title: string
  description: string
  children: ReactNode
}

function AnalyticsSection({
  title,
  description,
  children,
}: AnalyticsSectionProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-foreground text-base font-semibold tracking-tight">
          {title}
        </h2>
        <p className="text-muted-foreground text-sm leading-6">{description}</p>
      </div>
      {children}
    </section>
  )
}

function SummaryContent({ isPending, data }: SummarisedDataProps) {
  const summary = useMemo(
    () => (data ? summarizeCommonAnalytics(data) : null),
    [data]
  )
  const totalTrend = summary ? getTotalTrendChange(summary.trend) : null

  return (
    <div className="space-y-8 md:space-y-10">
      <AnalyticsSection
        title="Overview"
        description="At a glance across connected channels."
      >
        <SummarisedMetricsCards isPending={isPending} data={data} />
      </AnalyticsSection>

      <AnalyticsSection
        title="Breakdown"
        description="How interactions and publishing split across platforms."
      >
        <SummarisedChartCards
          isPending={isPending}
          data={data}
          summary={summary}
          totalTrend={totalTrend}
        />
      </AnalyticsSection>

      <AnalyticsSection
        title="Activity"
        description="Recent published posts and 30-day interaction movement."
      >
        <SummarisedRecentPosts
          isPending={isPending}
          data={data}
          summary={summary}
        />
      </AnalyticsSection>
    </div>
  )
}

function SummarisedMetricsCards({ isPending, data }: SummarisedDataProps) {
  if (isPending || !data) return <SocialMetricCardsSkeleton />
  return <SocialMetricCards posts={data.posts} histories={data.histories} />
}

//---------------------------------
// Summarised Chart Cards
//---------------------------------
interface SummarisedChartCardsProps extends SummarisedDataProps {
  summary: CommonAnalyticsSummary | null
  totalTrend: number | null
}

function SummarisedChartCards({
  isPending,
  data,
  summary,
  totalTrend,
}: SummarisedChartCardsProps) {
  if (isPending || !data)
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <ChartCardSkeleton variant="area" />
        <ChartCardSkeleton variant="bar" />
        <ChartCardSkeleton variant="donut" />
      </div>
    )
  if (!summary) return null

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      <TotalEngagementCard
        summary={summary}
        postCount={data.total}
        trend={totalTrend}
      />
      <LeadingChannelCard summary={summary} />
      <PostCountByChannelCard summary={summary} />
    </div>
  )
}

//---------------------------------
// Summarised Recent Posts
//---------------------------------
interface SummarisedRecentPostsProps extends SummarisedDataProps {
  summary: CommonAnalyticsSummary | null
}

function SummarisedRecentPosts({
  isPending,
  data,
  summary,
}: SummarisedRecentPostsProps) {
  if (isPending || !data) return <RecentPostsTableSkeleton />
  if (!summary) return null

  return (
    <div className="w-full overflow-x-auto">
      <TopPostsTable
        posts={data.posts}
        historiesByPostId={summary.historiesByPostId}
      />
    </div>
  )
}

//---------------------------------
// Loading Skeletons
//---------------------------------
type ChartCardSkeletonProps = {
  variant: 'area' | 'bar' | 'donut'
}

function ChartCardSkeleton({ variant }: ChartCardSkeletonProps) {
  return (
    <Card className="w-full max-w-[400px] min-w-0 gap-0 overflow-hidden rounded-xl border p-0 shadow-none">
      <div className="flex items-start justify-between gap-4 px-5 pt-4">
        <div className="min-w-0">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="mt-3 h-8 w-20 rounded-md" />
          <Skeleton className="mt-2 h-4 w-36 rounded-md" />
        </div>
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>

      <div className="mt-4 px-5">
        {variant === 'area' && <AreaChartSkeleton />}
        {variant === 'bar' && <BarChartSkeleton />}
        {variant === 'donut' && <DonutChartSkeleton />}
      </div>
    </Card>
  )
}

function AreaChartSkeleton() {
  return (
    <div className="h-[120px] pt-5">
      <Skeleton className="h-full rounded-t-[60%] rounded-b-xl" />
    </div>
  )
}

function BarChartSkeleton() {
  return (
    <div className="space-y-4 pt-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-16 rounded-md" />
        <Skeleton className="h-9 flex-1 rounded-md" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-16 rounded-md" />
        <Skeleton className="h-9 w-[72%] rounded-md" />
      </div>
    </div>
  )
}

function DonutChartSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 pt-2">
      <div className="border-accent relative size-28 rounded-full border-[22px]">
        <Skeleton className="bg-card absolute inset-5 rounded-full" />
      </div>
      <Skeleton className="size-3 rounded-full" />
    </div>
  )
}

function RecentPostsTableSkeleton() {
  const rows = Array.from({ length: 5 })

  return (
    <Card className="gap-0 rounded-xl p-0">
      <CardHeader className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-24 rounded-md" />
          <Skeleton className="h-4 w-72 max-w-full rounded-md" />
        </div>
        <Skeleton className="h-9 w-full rounded-md sm:w-[150px]" />
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <div className="overflow-x-auto border-y">
          <div className="grid min-w-[760px] grid-cols-[minmax(240px,1fr)_110px_120px_90px_110px_120px] gap-4 px-4 py-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-16 rounded-md" />
            ))}
          </div>
          {rows.map((_, index) => (
            <div
              key={index}
              className="grid min-w-[760px] grid-cols-[minmax(240px,1fr)_110px_120px_90px_110px_120px] items-center gap-4 border-t px-4 py-3"
            >
              <div className="space-y-2">
                <Skeleton className="h-4 w-full max-w-[320px] rounded-md" />
                <Skeleton className="h-4 w-1/2 max-w-[180px] rounded-md" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="ml-auto h-4 w-12 rounded-md" />
              <Skeleton className="ml-auto h-4 w-14 rounded-md" />
              <Skeleton className="h-7 w-24 rounded-md" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <Skeleton className="h-4 w-32 rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export const Route = createLazyRoute('/analytics')({
  component: AnalyticsPage,
})

export default AnalyticsPage

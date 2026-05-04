import { lazy, type ReactNode } from 'react'

import AnalyticsSectionBoundary from '../components/analytics-section-boundary'
import {
  ActivitySkeleton,
  BreakdownSkeleton,
  OverviewSkeleton,
} from '../components/analytics-skeletons'

const OverviewContainer = lazy(() => import('../containers/overview-container'))
const BreakdownContainer = lazy(
  () => import('../containers/breakdown-container')
)
const ActivityContainer = lazy(() => import('../containers/activity-container'))

export default function AnalyticsSummaryLayout() {
  return (
    <div className="space-y-8 md:space-y-10">
      <AnalyticsSection
        title="Overview"
        description="At a glance across connected channels."
      >
        <AnalyticsSectionBoundary
          title="Overview"
          fallback={<OverviewSkeleton />}
        >
          <OverviewContainer />
        </AnalyticsSectionBoundary>
      </AnalyticsSection>

      <AnalyticsSection
        title="Breakdown"
        description="How interactions and publishing split across platforms."
      >
        <AnalyticsSectionBoundary
          title="Breakdown"
          fallback={<BreakdownSkeleton />}
        >
          <BreakdownContainer />
        </AnalyticsSectionBoundary>
      </AnalyticsSection>

      <AnalyticsSection
        title="Activity"
        description="Recent published posts and 30-day interaction movement."
      >
        <AnalyticsSectionBoundary
          title="Activity"
          fallback={<ActivitySkeleton />}
        >
          <ActivityContainer />
        </AnalyticsSectionBoundary>
      </AnalyticsSection>
    </div>
  )
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

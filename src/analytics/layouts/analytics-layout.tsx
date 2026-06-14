import { ArrowUpRight, LockKeyhole } from 'lucide-react'
import { lazy, type ReactNode } from 'react'

import { LANDING_PRICING_URL } from '@/core/config/constant'
import AsyncSectionBoundary from '@/shared/components/async-section-boundary'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'

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

interface AnalyticsSummaryLayoutProps {
  hasPaidAnalyticsAccess: boolean
}

export default function AnalyticsSummaryLayout({
  hasPaidAnalyticsAccess,
}: AnalyticsSummaryLayoutProps) {
  return (
    <div className="space-y-8 md:space-y-10">
      <AnalyticsSection
        title="Overview"
        description="At a glance across connected channels."
      >
        <AsyncSectionBoundary
          title="Overview"
          fallback={<OverviewSkeleton />}
          description="Retry this section without affecting the rest of analytics."
        >
          <OverviewContainer />
        </AsyncSectionBoundary>
      </AnalyticsSection>

      <AnalyticsSection
        title="Breakdown"
        description="How interactions and publishing split across platforms."
      >
        {hasPaidAnalyticsAccess ? (
          <AsyncSectionBoundary
            title="Breakdown"
            fallback={<BreakdownSkeleton />}
            description="Retry this section without affecting the rest of analytics."
          >
            <BreakdownContainer />
          </AsyncSectionBoundary>
        ) : (
          <AnalyticsSectionLock
            preview="breakdown"
            title="Breakdown is included in Pro"
            description="Upgrade to compare interaction trends, leading platforms, and channel performance."
          />
        )}
      </AnalyticsSection>

      <AnalyticsSection
        title="Activity"
        description="Recent published posts and 30-day interaction movement."
      >
        {hasPaidAnalyticsAccess ? (
          <AsyncSectionBoundary
            title="Activity"
            fallback={<ActivitySkeleton />}
            description="Retry this section without affecting the rest of analytics."
          >
            <ActivityContainer />
          </AsyncSectionBoundary>
        ) : (
          <AnalyticsSectionLock
            preview="activity"
            title="Activity is included in Pro"
            description="Upgrade to review recent post performance and 30-day interaction movement."
          />
        )}
      </AnalyticsSection>
    </div>
  )
}

interface AnalyticsSectionLockProps {
  preview: 'breakdown' | 'activity'
  title: string
  description: string
}

function AnalyticsSectionLock({
  preview,
  title,
  description,
}: AnalyticsSectionLockProps) {
  return (
    <Card className="relative min-h-[340px] overflow-hidden rounded-xl border p-0 shadow-none">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 p-4 opacity-100 select-none sm:p-5"
      >
        {preview === 'breakdown' ? (
          <LockedBreakdownPreview />
        ) : (
          <LockedActivityPreview />
        )}
      </div>

      <div className="bg-background/38 absolute inset-0 backdrop-blur-[1px]" />

      <div className="relative z-10 flex min-h-[340px] items-center justify-center p-4 sm:p-6">
        <div className="bg-card/92 w-full max-w-md rounded-xl border p-5 shadow-[0_18px_60px_rgba(15,23,42,0.18)] ring-1 ring-black/5 backdrop-blur-md dark:shadow-[0_18px_60px_rgba(0,0,0,0.35)] dark:ring-white/8">
          <div className="flex items-start gap-3">
            <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg border">
              <LockKeyhole className="size-4" />
            </div>

            <div className="min-w-0">
              <h3 className="text-foreground text-sm font-semibold">{title}</h3>
              <p className="text-muted-foreground mt-1 text-sm leading-6">
                {description}
              </p>
            </div>
          </div>

          <Button asChild size="sm" className="mt-5 w-full sm:w-fit">
            <a href={LANDING_PRICING_URL}>
              Upgrade to Pro
              <ArrowUpRight className="size-3.5" />
            </a>
          </Button>
        </div>
      </div>
    </Card>
  )
}

function LockedBreakdownPreview() {
  return (
    <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <LockedPreviewCard>
        <PreviewHeader titleWidth="w-32" valueWidth="w-20" helperWidth="w-36" />
        <PreviewAreaChart />
      </LockedPreviewCard>

      <LockedPreviewCard>
        <PreviewHeader titleWidth="w-28" valueWidth="w-24" helperWidth="w-32" />
        <PreviewHorizontalBars />
      </LockedPreviewCard>

      <LockedPreviewCard className="md:col-span-2 xl:col-span-1">
        <PreviewHeader titleWidth="w-24" valueWidth="w-16" helperWidth="w-36" />
        <PreviewDonutChart />
      </LockedPreviewCard>
    </div>
  )
}

function LockedActivityPreview() {
  return (
    <div className="bg-card flex h-full overflow-hidden rounded-xl border shadow-sm">
      <div className="flex min-w-[700px] flex-1 flex-col">
        <div className="flex shrink-0 flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="bg-muted-foreground/18 h-4 w-24 rounded-md" />
            <div className="bg-muted-foreground/12 h-3 w-72 max-w-full rounded-md" />
          </div>
          <div className="bg-muted-foreground/12 h-8 w-full rounded-md sm:w-[150px]" />
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden border-y">
          <div className="grid grid-cols-[minmax(240px,1fr)_110px_120px_90px_110px_120px] gap-4 px-4 py-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-muted-foreground/14 h-3 w-16 rounded-md"
              />
            ))}
          </div>

          {Array.from({ length: 3 }).map((_, rowIndex) => (
            <PreviewActivityRow key={rowIndex} />
          ))}

          <div className="from-card pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t to-transparent" />
        </div>
      </div>
    </div>
  )
}

function PreviewActivityRow() {
  return (
    <div className="grid grid-cols-[minmax(240px,1fr)_110px_120px_90px_110px_120px] items-center gap-4 border-t px-4 py-4">
      <div className="space-y-2">
        <div className="bg-muted-foreground/16 h-3.5 w-full max-w-[320px] rounded-md" />
        <div className="bg-muted-foreground/10 h-3 w-1/2 max-w-[180px] rounded-md" />
      </div>
      <div className="bg-muted-foreground/12 h-6 w-20 rounded-full" />
      <div className="bg-muted-foreground/12 h-3.5 w-24 rounded-md" />
      <div className="bg-muted-foreground/16 ml-auto h-3.5 w-12 rounded-md" />
      <div className="bg-muted-foreground/16 ml-auto h-3.5 w-14 rounded-md" />
      <PreviewSparkline />
    </div>
  )
}

interface LockedPreviewCardProps {
  children: ReactNode
  className?: string
}

function LockedPreviewCard({ children, className }: LockedPreviewCardProps) {
  return (
    <div
      className={`bg-card min-h-[220px] rounded-xl border p-5 shadow-sm ${className ?? ''}`}
    >
      {children}
    </div>
  )
}

interface PreviewHeaderProps {
  titleWidth: string
  valueWidth: string
  helperWidth: string
}

function PreviewHeader({
  titleWidth,
  valueWidth,
  helperWidth,
}: PreviewHeaderProps) {
  return (
    <div className="space-y-2">
      <div
        className={`bg-muted-foreground/16 h-3.5 rounded-md ${titleWidth}`}
      />
      <div className={`bg-muted-foreground/18 h-7 rounded-md ${valueWidth}`} />
      <div className={`bg-muted-foreground/12 h-3 rounded-md ${helperWidth}`} />
    </div>
  )
}

function PreviewAreaChart() {
  return (
    <div className="bg-muted/20 relative mt-6 h-36 overflow-hidden rounded-lg border">
      <PreviewGrid />
      <svg
        viewBox="0 0 320 140"
        preserveAspectRatio="none"
        className="text-muted-foreground/55 absolute inset-0 h-full w-full"
      >
        <path
          d="M0 118 C34 92 52 108 82 80 C116 48 142 72 172 44 C210 10 238 46 268 24 C292 8 306 18 320 12 L320 140 L0 140 Z"
          fill="currentColor"
          opacity="0.18"
        />
        <path
          d="M0 118 C34 92 52 108 82 80 C116 48 142 72 172 44 C210 10 238 46 268 24 C292 8 306 18 320 12"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path
          d="M0 126 C32 104 58 116 86 96 C126 68 150 94 184 70 C218 46 250 82 282 58 C300 44 310 48 320 42"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3"
          opacity="0.45"
        />
      </svg>
    </div>
  )
}

function PreviewHorizontalBars() {
  return (
    <div className="mt-7 space-y-5">
      {[
        { label: 'w-16', value: 'w-[86%]' },
        { label: 'w-14', value: 'w-[58%]' },
        { label: 'w-20', value: 'w-[72%]' },
      ].map((item, index) => (
        <div key={index} className="flex items-center gap-4">
          <div
            className={`bg-muted-foreground/14 h-3 rounded-md ${item.label}`}
          />
          <div className="bg-muted/70 h-9 flex-1 overflow-hidden rounded-md">
            <div
              className={`bg-muted-foreground/38 h-full rounded-md ${item.value}`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function PreviewDonutChart() {
  return (
    <div className="mt-5 flex items-center justify-center gap-6">
      <svg viewBox="0 0 120 120" className="text-muted-foreground/48 size-32">
        <circle
          cx="60"
          cy="60"
          r="42"
          fill="none"
          stroke="currentColor"
          strokeWidth="20"
          opacity="0.18"
        />
        <circle
          cx="60"
          cy="60"
          r="42"
          fill="none"
          stroke="currentColor"
          strokeDasharray="176 264"
          strokeLinecap="round"
          strokeWidth="20"
          transform="rotate(-90 60 60)"
        />
      </svg>

      <div className="space-y-3">
        <PreviewLegendLine width="w-20" />
        <PreviewLegendLine width="w-16" />
      </div>
    </div>
  )
}

function PreviewSparkline() {
  return (
    <svg
      viewBox="0 0 96 28"
      preserveAspectRatio="none"
      className="text-muted-foreground/42 h-7 w-24"
    >
      <path
        d="M0 22 C12 15 18 18 28 11 C40 3 50 16 62 9 C74 2 82 6 96 4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <path
        d="M0 22 C12 15 18 18 28 11 C40 3 50 16 62 9 C74 2 82 6 96 4 L96 28 L0 28 Z"
        fill="currentColor"
        opacity="0.14"
      />
    </svg>
  )
}

function PreviewGrid() {
  return (
    <div className="absolute inset-0 grid grid-rows-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="border-muted-foreground/10 border-b" />
      ))}
    </div>
  )
}

function PreviewLegendLine({ width }: { width: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-muted-foreground/28 size-2.5 rounded-full" />
      <div className={`bg-muted-foreground/14 h-3 rounded-md ${width}`} />
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

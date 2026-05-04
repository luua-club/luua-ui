import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Settings } from 'lucide-react'

import { analyticsApi } from '@/core/api/analytics.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { useUserState } from '@/core/hooks/user-state.hook'
import { type IAnalyticsActivityPoint } from '@/core/models/analytics.model'
import { extractUserInitial } from '@/core/utils/common.util'
import { ActivityGraph } from '@/shared/components/activity-graph'
import { DownloadSparkline } from '@/shared/components/download-sparkline'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'

const ACTIVITY_WEEKS = 52

function formatRole(role: string | null | undefined) {
  if (!role) return 'Viewer'

  if (role === 'project_admin' || role === 'admin') return 'Admin'
  if (role === 'member') return 'Member'
  if (role === 'owner') return 'Owner'

  return role
    .split('_')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function buildActivitySparklineData(activity: IAnalyticsActivityPoint[]) {
  const visibleDays = activity.slice(-12 * 7)

  return Array.from(
    { length: Math.ceil(visibleDays.length / 7) },
    (_, index) => {
      const week = visibleDays.slice(index * 7, index * 7 + 7)
      const firstDay = week[0]

      return {
        day: firstDay?.date ?? '',
        downloads: week.reduce((sum, point) => sum + point.count, 0),
      }
    }
  ).filter(point => point.day)
}

function getActivitySummary(activity: IAnalyticsActivityPoint[]) {
  const totalPosts = activity.reduce((sum, point) => sum + point.count, 0)
  const activeDays = activity.filter(point => point.count > 0).length
  const weekly = buildActivitySparklineData(activity)
  const peakWeek = Math.max(...weekly.map(point => point.downloads), 0)

  return {
    totalPosts,
    activeDays,
    peakWeek,
  }
}

function ProfileSummaryCard({
  activity,
}: {
  activity: IAnalyticsActivityPoint[]
}) {
  const user = useUserState()

  if (!user) return null

  const currentProject = user.currentProject
  const projectRole =
    currentProject?.project_role ??
    user.projects.find(project => project.id === currentProject?.id)
      ?.project_role
  const sparklineData = buildActivitySparklineData(activity)

  return (
    <Card className="min-w-0 gap-4 rounded-lg p-4 shadow-none">
      <div className="flex items-start gap-2.5">
        <Avatar className="size-10 rounded-full">
          <AvatarImage src={user.profile_image ?? undefined} alt={user.name} />
          <AvatarFallback className="bg-amber-400 font-semibold text-black">
            {extractUserInitial(user.name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold">{user.name}</h2>
              <p className="text-muted-foreground truncate text-xs font-medium">
                {user.email}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground -mt-1 size-8 shrink-0"
              asChild
            >
              <Link
                to="/settings"
                search={{ tab: 'account' }}
                aria-label="Open settings"
              >
                <Settings className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs font-medium">Project</p>
          <p className="mt-1 truncate text-sm font-semibold">
            {currentProject?.name || 'No project selected'}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs font-medium">Org</p>
          <p className="mt-1 truncate text-sm font-semibold">
            {user.currentOrg?.name || 'No organization selected'}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs font-medium">Role</p>
          <p className="mt-1 truncate text-sm font-semibold">
            {formatRole(projectRole)}
          </p>
        </div>
      </div>

      {sparklineData.length > 0 && (
        <div className="border-border/70 border-t pt-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-muted-foreground text-xs font-medium">
              Overall Activity
            </p>
            <p className="text-muted-foreground text-xs">Last 12 weeks</p>
          </div>
          <DownloadSparkline
            package="publishing-activity"
            data={sparklineData}
            range="last-year"
            variant="area"
            color="var(--color-foreground)"
            width={220}
            height={42}
            strokeWidth={1.75}
            showBaseline
            showLabel
            showTrend
          />
        </div>
      )}
    </Card>
  )
}

function ProfileActivity() {
  const { data, isPending } = useQuery({
    queryKey: [QUERY_KEYS.analytics, 'dashboard-activity'],
    queryFn: () => analyticsApi.getActivity({ weeks: ACTIVITY_WEEKS }),
    staleTime: 15 * 60_000,
  })

  const activity = data?.activity ?? []
  const endDate = data?.end_date
  const activitySummary = data
    ? {
        totalPosts: data.total_posts,
        activeDays: data.active_days,
        peakWeek: data.peak_week,
      }
    : getActivitySummary(activity)

  return (
    <div className="mb-6 grid items-stretch gap-4 xl:grid-cols-[minmax(280px,0.64fr)_minmax(0,1.36fr)]">
      <ProfileSummaryCard activity={activity} />
      <Card className="w-full max-w-full gap-6 rounded-lg p-4 shadow-none">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold">Publishing Activity</h2>
            <p className="text-muted-foreground mt-1 text-xs font-medium">
              Daily posts published over the last year
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-sm border px-3 py-1 text-right">
            <div>
              <p className="text-muted-foreground text-[11px] font-medium">
                Posts
              </p>
              <p className="text-sm font-semibold">
                {activitySummary.totalPosts}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-[11px] font-medium">
                Days
              </p>
              <p className="text-sm font-semibold">
                {activitySummary.activeDays}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-[11px] font-medium">
                Peak
              </p>
              <p className="text-sm font-semibold">
                {activitySummary.peakWeek}
              </p>
            </div>
          </div>
        </div>

        {isPending ? (
          <div className="bg-muted h-28 w-[684px] max-w-full animate-pulse rounded-md" />
        ) : (
          <ActivityGraph
            data={activity}
            weeks={ACTIVITY_WEEKS}
            blockSize={9}
            blockRadius={2}
            endDate={endDate}
            activityLabel="post"
            colorScale={[
              'bg-muted-foreground/4 ring-1 ring-muted-foreground/12 dark:bg-muted-foreground/12 dark:ring-muted-foreground/20',
              'bg-emerald-200/80 dark:bg-emerald-950',
              'bg-emerald-300 dark:bg-emerald-800',
              'bg-emerald-500 dark:bg-emerald-600',
              'bg-emerald-700 dark:bg-emerald-400',
            ]}
            className="-mx-1 max-w-full px-1 pb-1"
          />
        )}
      </Card>
    </div>
  )
}

export default ProfileActivity

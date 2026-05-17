import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Settings } from 'lucide-react'

import { analyticsApi } from '@/core/api/analytics.api'
import { CurrentUserPlanAvatar } from '@/core/components/billing'
import { QUERY_KEYS } from '@/core/config/constant'
import { useUserState } from '@/core/hooks/user-state.hook'
import { type IAnalyticsActivityPoint } from '@/core/models/analytics.model'
import { ActivityGraph } from '@/shared/components/activity-graph'
import { DownloadSparkline } from '@/shared/components/download-sparkline'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'

const ACTIVITY_WEEKS = 52
const PROFILE_ACTIVITY_STALE_TIME = 15 * 60_000
const PROFILE_ACTIVITY_CARD_CLASS = 'h-[224px] rounded-lg p-4 pb-0 shadow-sm'
const PROFILE_ACTIVITY_INTENSITY_THRESHOLDS = [1, 2, 3] as const

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
    <Card className={`${PROFILE_ACTIVITY_CARD_CLASS} min-w-0 gap-4`}>
      <div className="flex items-start gap-2.5">
        <CurrentUserPlanAvatar
          name={user.name}
          profileImage={user.profile_image}
          plan={user.plan}
          avatarClassName="size-10"
          fallbackClassName="font-semibold"
        />

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
  const user = useUserState()

  if (!user) return null

  return <ProfileActivityContent />
}

function ProfileActivityContent() {
  const { data } = useSuspenseQuery({
    queryKey: [QUERY_KEYS.analytics, 'dashboard-activity'],
    queryFn: () => analyticsApi.getActivity({ weeks: ACTIVITY_WEEKS }),
    staleTime: PROFILE_ACTIVITY_STALE_TIME,
  })

  const activity = data.activity

  return (
    <div className="mb-6 grid items-stretch gap-4 xl:grid-cols-[minmax(280px,0.64fr)_minmax(0,1.36fr)]">
      <ProfileSummaryCard activity={activity} />
      <Card
        className={`${PROFILE_ACTIVITY_CARD_CLASS} w-full max-w-full gap-9`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold">Publishing Activity</h2>
            <p className="text-muted-foreground mt-1 text-xs font-medium">
              Daily posts published over the last year
            </p>
          </div>

          <Button variant="outline" size="sm" className="w-fit" asChild>
            <Link to="/analytics" className="text-xs">
              View Analytics
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        <ActivityGraph
          data={activity}
          weeks={ACTIVITY_WEEKS}
          blockSize={9}
          blockRadius={2}
          endDate={data.end_date}
          activityLabel="post"
          intensityThresholds={PROFILE_ACTIVITY_INTENSITY_THRESHOLDS}
          colorScale={[
            'bg-muted-foreground/4 ring-1 ring-muted-foreground/12 dark:bg-muted-foreground/12 dark:ring-muted-foreground/20',
            'bg-emerald-300 dark:bg-emerald-800',
            'bg-emerald-500 dark:bg-emerald-600',
            'bg-emerald-700 dark:bg-emerald-400',
          ]}
          className="-mx-1 max-w-full px-1 pb-1"
        />
      </Card>
    </div>
  )
}

export default ProfileActivity

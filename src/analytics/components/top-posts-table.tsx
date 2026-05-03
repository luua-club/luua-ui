import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table'
import { format, subDays } from 'date-fns'
import { ArrowUpDown, ExternalLink } from 'lucide-react'
import * as React from 'react'

import {
  type AnalyticsChannel,
  type IAnalyticsPost,
  type IAnalyticsPostHistoryResponse,
} from '@/core/models/analytics.model'
import { getSocialPlatformLabel } from '@/core/utils/social.utils'
import { DownloadSparkline } from '@/shared/components/download-sparkline'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'
import { cn } from '@/shared/utils'

import {
  commonEngagement,
  commonEngagementPoint,
  formatNumber,
  metricValue,
  parseDateKey,
  toDateKey,
} from '../utils'
import ChannelBadge from './channel-badge'

const RECENT_POST_TREND_DAYS = 30

type TopPostsTableProps = {
  posts: IAnalyticsPost[]
  historiesByPostId: Map<string, IAnalyticsPostHistoryResponse>
}

type SortableHeaderProps = {
  label: string
  column: {
    getIsSorted: () => false | 'asc' | 'desc'
    toggleSorting: (desc?: boolean) => void
  }
  align?: 'left' | 'right'
}

function SortableHeader({
  label,
  column,
  align = 'left',
}: SortableHeaderProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn('h-8 px-2 font-medium', align === 'right' && 'ml-auto')}
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {label}
      <ArrowUpDown className="size-3.5" />
    </Button>
  )
}

function formatPublishedDate(value: string | null) {
  if (!value) return '-'

  return format(new Date(value), 'MMM d, yyyy')
}

function buildTrendData(
  post: IAnalyticsPost,
  history: IAnalyticsPostHistoryResponse | undefined
) {
  const orderedDataPoints =
    history?.data_points
      .slice()
      .sort((a, b) => a.snapshot_date.localeCompare(b.snapshot_date)) ?? []
  const lastDataPoint = orderedDataPoints[orderedDataPoints.length - 1]
  const startDate = lastDataPoint
    ? subDays(
        parseDateKey(lastDataPoint.snapshot_date),
        RECENT_POST_TREND_DAYS - 1
      )
    : null
  const points = orderedDataPoints
    .filter(point => {
      if (!startDate) return true
      return parseDateKey(point.snapshot_date) >= startDate
    })
    .map(point => ({
      day: point.snapshot_date,
      downloads: commonEngagementPoint(point),
    }))

  if (points.length >= 2) return points

  const fallbackDate =
    post.latest_metrics.snapshot_date ?? toDateKey(post.published_at) ?? ''

  return [
    { day: fallbackDate, downloads: 0 },
    { day: fallbackDate, downloads: commonEngagement(post) },
  ]
}

function buildColumns(
  historiesByPostId: Map<string, IAnalyticsPostHistoryResponse>
): ColumnDef<IAnalyticsPost>[] {
  return [
    {
      accessorKey: 'content_preview',
      header: 'Post',
      cell: ({ row }) => {
        const post = row.original

        return (
          <div className="max-w-[420px] whitespace-normal">
            <p className="line-clamp-2 text-sm leading-snug">
              {post.content_preview || 'Untitled post'}
            </p>
            {post.has_media && (
              <p className="text-muted-foreground mt-1 text-xs">Has media</p>
            )}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'channel',
      header: 'Channel',
      cell: ({ row }) => <ChannelBadge channel={row.original.channel} />,
      filterFn: (row, id, value: AnalyticsChannel | 'all') => {
        if (value === 'all') return true
        return row.getValue(id) === value
      },
      enableSorting: false,
    },
    {
      id: 'published_at',
      accessorFn: row => (row.published_at ? new Date(row.published_at) : null),
      header: ({ column }) => (
        <SortableHeader label="Published" column={column} />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatPublishedDate(row.original.published_at)}
        </span>
      ),
      sortingFn: (rowA, rowB) => {
        const a = rowA.original.published_at
          ? new Date(rowA.original.published_at).getTime()
          : 0
        const b = rowB.original.published_at
          ? new Date(rowB.original.published_at).getTime()
          : 0

        return a - b
      },
    },
    {
      id: 'likes',
      accessorFn: row => metricValue(row.latest_metrics.likes),
      header: ({ column }) => (
        <SortableHeader label="Likes" column={column} align="right" />
      ),
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatNumber(metricValue(row.original.latest_metrics.likes))}
        </div>
      ),
    },
    {
      id: 'comments',
      accessorFn: row => metricValue(row.latest_metrics.comments),
      header: ({ column }) => (
        <SortableHeader label="Comments" column={column} align="right" />
      ),
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatNumber(metricValue(row.original.latest_metrics.comments))}
        </div>
      ),
    },
    {
      id: 'trend',
      header: 'Trend',
      cell: ({ row }) => {
        const post = row.original
        const data = buildTrendData(post, historiesByPostId.get(post.post_id))

        return (
          <DownloadSparkline
            package={`post-${post.post_id}`}
            data={data}
            variant="area"
            color="var(--color-foreground)"
            width={150}
            height={34}
            strokeWidth={1.75}
            showBaseline
            showLabel
            showTrend
            className="w-48"
          />
        )
      },
      enableSorting: false,
    },
    {
      id: 'interactions',
      accessorFn: commonEngagement,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const url = row.original.external_url

        if (!url) return null

        return (
          <Button variant="ghost" size="icon" asChild>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              aria-label="Open published post"
            >
              <ExternalLink className="size-4" />
            </a>
          </Button>
        )
      },
      enableSorting: false,
    },
  ]
}

export default function TopPostsTable({
  posts,
  historiesByPostId,
}: TopPostsTableProps) {
  const columns = React.useMemo(
    () => buildColumns(historiesByPostId),
    [historiesByPostId]
  )
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'published_at', desc: true },
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      interactions: false,
    })

  const table = useReactTable({
    data: posts,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  const channelFilter =
    (table.getColumn('channel')?.getFilterValue() as AnalyticsChannel) ?? 'all'

  return (
    <Card className="gap-0 rounded-xl p-0 shadow-[0_18px_45px_rgba(0,0,0,0.12)] dark:shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
      <CardHeader className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-sm">Recent Posts</CardTitle>
          <p className="text-muted-foreground mt-1 text-xs">
            Sorted by latest published date. Trend shows likes + comments over
            the last 30 days.
          </p>
        </div>
        <Select
          value={channelFilter}
          onValueChange={value => {
            table
              .getColumn('channel')
              ?.setFilterValue(value === 'all' ? undefined : value)
          }}
        >
          <SelectTrigger size="sm" className="w-full sm:w-[150px]">
            <SelectValue placeholder="Channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All channels</SelectItem>
            <SelectItem value="LinkedIn">
              {getSocialPlatformLabel('LinkedIn')}
            </SelectItem>
            <SelectItem value="Twitter">
              {getSocialPlatformLabel('Twitter')}
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="px-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="px-4 py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  No posts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <p className="text-muted-foreground text-xs">
            Showing {table.getRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} posts
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

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
import { format } from 'date-fns'
import { ArrowUpDown, ExternalLink } from 'lucide-react'
import * as React from 'react'

import {
  type AnalyticsChannel,
  type IAnalyticsPost,
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

import ChannelBadge from '../../shared/components/channel-badge'
import {
  commonEngagement,
  formatNumber,
  metricValue,
  toDateKey,
} from '../utils/utils'

type TopPostsTableProps = {
  posts: IAnalyticsPost[]
  showTrends?: boolean
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

function latestMetric(post: IAnalyticsPost, metric: 'likes' | 'comments') {
  return metricValue(post.latest_metrics?.[metric])
}

function buildTrendData(post: IAnalyticsPost) {
  const points =
    post.trend?.map(point => ({
      day: point.date,
      downloads: point.value,
    })) ?? []

  if (points.length >= 2) return points

  const fallbackDate =
    post.latest_metrics?.snapshot_date ?? toDateKey(post.published_at) ?? ''

  return [
    { day: fallbackDate, downloads: 0 },
    { day: fallbackDate, downloads: commonEngagement(post) },
  ]
}

function buildColumns(showTrends: boolean): ColumnDef<IAnalyticsPost>[] {
  const columns: ColumnDef<IAnalyticsPost>[] = [
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
      accessorFn: row => latestMetric(row, 'likes'),
      header: ({ column }) => (
        <SortableHeader label="Likes" column={column} align="right" />
      ),
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatNumber(latestMetric(row.original, 'likes'))}
        </div>
      ),
    },
    {
      id: 'comments',
      accessorFn: row => latestMetric(row, 'comments'),
      header: ({ column }) => (
        <SortableHeader label="Comments" column={column} align="right" />
      ),
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatNumber(latestMetric(row.original, 'comments'))}
        </div>
      ),
    },
  ]

  if (showTrends) {
    columns.push({
      id: 'trend',
      header: 'Trend',
      cell: ({ row }) => {
        const post = row.original
        const data = buildTrendData(post)

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
    })
  }

  columns.push(
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
    }
  )

  return columns
}

export default function TopPostsTable({
  posts,
  showTrends = true,
}: TopPostsTableProps) {
  const columns = React.useMemo(() => buildColumns(showTrends), [showTrends])
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
            {showTrends
              ? 'Sorted by latest published date. Trend shows likes + comments over the last 30 days.'
              : 'Sorted by latest published date across connected channels.'}
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

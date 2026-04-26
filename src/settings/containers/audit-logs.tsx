import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'

import { auditApi } from '@/core/api/audit.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { useUserState } from '@/core/hooks/user-state.hook'
import {
  AuditCategory,
  getEventTypesForCategory,
} from '@/core/models/audit-log.model'
import { UserState } from '@/core/models/user.model'
import PaginationList from '@/shared/components/pagination-list'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { Skeleton } from '@/shared/ui/skeleton'

import AuditLogFilters from '../components/audit-log-filters'
import AuditLogRow from '../components/audit-log-row'

const PAGE_SIZE = 20

function AuditLogRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-2 py-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="size-6 rounded-full" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="ml-auto h-4 w-40" />
    </div>
  )
}

function AuditLogs(_props: { user: UserState }) {
  const user = useUserState()
  const projectName = user?.currentProject?.name

  const [category, setCategory] = useState<AuditCategory>('all')
  const [eventType, setEventType] = useState<string>('all')
  const [offset, setOffset] = useState(0)

  const queryEventType = eventType === 'all' ? undefined : eventType
  const categoryEventTypes = useMemo(
    () => getEventTypesForCategory(category),
    [category]
  )

  const filterKey = useMemo(
    () =>
      queryEventType ??
      (categoryEventTypes.length > 0
        ? [...categoryEventTypes].sort().join(',')
        : 'all'),
    [queryEventType, categoryEventTypes]
  )

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.auditLogs, filterKey, offset],
    queryFn: () => {
      if (queryEventType) {
        return auditApi.getAuditLogs({
          event_type: queryEventType,
          limit: PAGE_SIZE,
          offset,
        })
      }
      if (categoryEventTypes.length > 0) {
        return auditApi.getAuditLogs({
          event_types: categoryEventTypes,
          limit: PAGE_SIZE,
          offset,
        })
      }
      return auditApi.getAuditLogs({ limit: PAGE_SIZE, offset })
    },
    staleTime: 30_000,
  })

  const response = data?.data
  const totalFromResponse = response?.total

  const [cachedTotal, setCachedTotal] = useState(0)
  useEffect(() => {
    setCachedTotal(0)
  }, [filterKey])
  useEffect(() => {
    if (data?.data && typeof data.data.total === 'number') {
      setCachedTotal(data.data.total)
    }
  }, [data])

  const total = totalFromResponse ?? cachedTotal
  const logs = response?.logs ?? []

  const filterActive = filterKey !== 'all'

  const showingFrom = total === 0 ? 0 : offset + 1
  const showingTo = Math.min(offset + logs.length, total)

  const resetFilters = () => {
    setCategory('all')
    setEventType('all')
    setOffset(0)
    setCachedTotal(0)
  }

  const handleCategoryChange = (next: AuditCategory) => {
    setCategory(next)
    setEventType('all')
    setOffset(0)
    setCachedTotal(0)
  }

  const handleEventTypeChange = (next: string) => {
    setEventType(next)
    setOffset(0)
    setCachedTotal(0)
  }

  return (
    <>
      <div className="py-4">
        <h1 className="text-lg font-medium">Audit Logs</h1>
        {projectName && (
          <p className="text-muted-foreground text-sm">
            Activity in <span className="font-medium">{projectName}</span>
          </p>
        )}
      </div>
      <Separator />

      <div className="flex flex-wrap items-center justify-between gap-3 py-4">
        <AuditLogFilters
          category={category}
          eventType={eventType}
          onCategoryChange={handleCategoryChange}
          onEventTypeChange={handleEventTypeChange}
        />
        {total > 0 && !isLoading && (
          <span className="text-muted-foreground text-xs">
            Showing {showingFrom}–{showingTo} of {total}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="divide-border divide-y">
          {Array.from({ length: 4 }).map((_, i) => (
            <AuditLogRowSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-muted-foreground text-sm">
            Couldn&apos;t load audit logs.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            Retry
          </Button>
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <p className="text-foreground text-sm font-medium">
            {total === 0 && !filterActive
              ? 'No audit log entries yet'
              : 'No events match the current filter'}
          </p>
          <p className="text-muted-foreground max-w-md text-xs">
            {total === 0 && !filterActive
              ? 'Activity in this project — generations, publishes, team changes, billing — will appear here.'
              : 'Try a different category or event.'}
          </p>
          {(total > 0 || filterActive) && (
            <Button size="sm" variant="outline" onClick={resetFilters}>
              Reset filters
            </Button>
          )}
        </div>
      ) : (
        <div className="divide-border divide-y">
          {logs.map(item => (
            <AuditLogRow key={item.id} item={item} />
          ))}
        </div>
      )}

      {(total > PAGE_SIZE || offset > 0) && !isError && (
        <div className="pt-6">
          <PaginationList
            limit={PAGE_SIZE}
            offset={offset}
            total={total}
            onOffsetChange={setOffset}
          />
        </div>
      )}
    </>
  )
}

export default AuditLogs

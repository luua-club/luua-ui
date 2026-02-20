import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format, parseISO } from 'date-fns'
import {
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Loader,
  RefreshCw,
  Text,
  Trash2,
  XCircle,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { postsApi } from '@/core/api/posts.api'
import Post from '@/core/components/Post'
import { QUERY_KEYS, SOCIAL_PLATFORM } from '@/core/config/constant'
import { type channelType } from '@/core/models/social.model'
import { IEvent } from '@/posts-view/models/interfaces'
import { getPublishedUrl } from '@/posts-view/utils/helpers'
import { Button } from '@/shared/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'

const STATUS_META = {
  Published: {
    label: 'Published',
    icon: CheckCircle,
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  Scheduled: {
    label: 'Scheduled',
    icon: Clock,
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  Queued: {
    label: 'Queued',
    icon: Loader,
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  Failed: {
    label: 'Failed',
    icon: XCircle,
    className: 'bg-red-50 text-red-700 border-red-200',
  },
} as const

interface IProps {
  event: IEvent
  children: React.ReactNode
}

export function EventDetailsDialog({ event, children }: IProps) {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const startDate = parseISO(event.startDate)
  const publishedUrl = getPublishedUrl(event.channel, event.external_id)
  const statusMeta = STATUS_META[event.status]
  const StatusIcon = statusMeta.icon
  const fallbackChannel: channelType = 'LinkedIn'
  const resolvedChannel =
    SOCIAL_PLATFORM.find(platform => platform.name === event.channel)?.name ??
    fallbackChannel

  const deleteScheduledMutation = useMutation({
    mutationFn: () => postsApi.deleteScheduledPost(event.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.calendarEvents] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.scheduleList] })
      toast.success('Scheduled post deleted')
      setIsOpen(false)
    },
    onError: () => {
      toast.error('Failed to delete scheduled post')
    },
  })

  const retryPostMutation = useMutation({
    mutationFn: () => postsApi.retryPost(event.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.calendarEvents] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.publishList] })
      toast.success('Retry requested')
      setIsOpen(false)
    },
    onError: () => {
      toast.error('Failed to retry post')
    },
  })

  const handleReschedule = () => {
    toast.info('Reschedule is not integrated yet')
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          onPointerDown={e => e.stopPropagation()}
          onMouseDown={e => e.stopPropagation()}
          onClick={e => {
            e.stopPropagation()
          }}
        >
          {children}
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={8}
        className="w-[360px] p-0 sm:w-[420px]"
        onPointerDown={e => e.stopPropagation()}
        onMouseDown={e => e.stopPropagation()}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-medium">
            {format(startDate, "MMM d, h:mm a '(GMT'xxx')'")}
          </p>
          <span
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium ${statusMeta.className}`}
          >
            <StatusIcon
              className={event.status === 'Queued' ? 'animate-spin' : undefined}
              size={12}
            />
            {statusMeta.label}
          </span>
        </div>

        <div className="bg-accent/80 max-h-[340px] space-y-3 overflow-auto border-b">
          {event.content ? (
            <div className="p-4">
              <Post
                id={event.id}
                channel={resolvedChannel}
                content={event.content}
                status={event.status}
                external_id={event.external_id ?? undefined}
                maintainFormatting
              />
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">
              No details available.
            </div>
          )}
        </div>

        {event.status !== 'Queued' && (
          <div className="flex items-center justify-end gap-2 p-3">
            {event.status === 'Published' && (
              <Button
                size="sm"
                onClick={() => {
                  if (!publishedUrl) {
                    toast.error('Published link not available')
                    return
                  }
                  setIsOpen(false)
                  window.open(publishedUrl, '_blank', 'noopener,noreferrer')
                }}
              >
                <ExternalLink className="size-4" />
                View Post
              </Button>
            )}

            {event.status === 'Scheduled' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReschedule}
                  disabled={deleteScheduledMutation.isPending}
                >
                  <Calendar className="size-4" />
                  Reschedule
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteScheduledMutation.mutate()}
                  disabled={deleteScheduledMutation.isPending}
                >
                  <Trash2 className="size-4" />
                  {deleteScheduledMutation.isPending
                    ? 'Deleting...'
                    : 'Delete Schedule'}
                </Button>
              </>
            )}

            {event.status === 'Failed' && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => retryPostMutation.mutate()}
                disabled={retryPostMutation.isPending}
              >
                <RefreshCw
                  className={`size-4 ${retryPostMutation.isPending ? 'animate-spin' : ''}`}
                />
                {retryPostMutation.isPending ? 'Retrying...' : 'Retry Post'}
              </Button>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

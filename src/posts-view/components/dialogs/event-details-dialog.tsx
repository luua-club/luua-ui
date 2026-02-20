import { format, parseISO } from 'date-fns'
import { Calendar, ExternalLink, Text } from 'lucide-react'
import { useState } from 'react'

import { IEvent } from '@/posts-view/models/interfaces'
import { getPublishedUrl } from '@/posts-view/utils/helpers'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'

interface IProps {
  event: IEvent
  children: React.ReactNode
}

export function EventDetailsDialog({ event, children }: IProps) {
  const [isOpen, setIsOpen] = useState(false)

  const startDate = parseISO(event.startDate)
  const publishedUrl = getPublishedUrl(event.channel, event.external_id)

  return (
    <>
      <div
        onClick={e => {
          e.stopPropagation()
          setIsOpen(true)
        }}
      >
        {children}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-background max-w-md p-6">
          <DialogClose />
          <DialogHeader>
            <DialogTitle>{event.title}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="flex items-start gap-2">
              <Calendar className="mt-1 size-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-muted-foreground text-sm">
                  {format(startDate, 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>

            {event.description && (
              <div className="flex items-start gap-2">
                <Text className="mt-1 size-4 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Details</p>
                  <p className="text-muted-foreground text-sm">
                    {event.description}
                  </p>
                </div>
              </div>
            )}

            {event.content && (
              <div className="flex items-start gap-2">
                <Text className="mt-1 size-4 shrink-0 opacity-0" />
                <div>
                  <p className="text-sm font-medium">Content</p>
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                    {event.content}
                  </p>
                </div>
              </div>
            )}

            {publishedUrl && (
              <div className="flex items-start gap-2">
                <ExternalLink className="mt-1 size-4 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Published post</p>
                  <a
                    href={publishedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    View on {event.channel}
                  </a>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

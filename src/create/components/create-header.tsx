import { Calendar, Send } from 'lucide-react'

import { DraftBadge } from '@/shared/components/post-state-badge'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'

interface CreateHeaderProps {
  title?: string
  updatedAt?: string
  onSchedule?: () => void
  onPublish?: () => void
}

function CreateHeader({
  title = 'Untitled',
  updatedAt,
  onSchedule,
  onPublish,
}: CreateHeaderProps) {
  return (
    <header className="bg-secondary dark:bg-card flex items-center justify-between border-b px-3 py-2.5 sm:px-4">
      {/* Left: title + badge + timestamp */}
      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="text-foreground max-w-[140px] truncate text-sm font-semibold sm:max-w-xs">
            {title}
          </span>

          <DraftBadge />
        </div>
        {updatedAt && (
          <p className="text-muted-foreground text-xs">{updatedAt}</p>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Button variant="default" size="sm" onClick={onSchedule}>
          <Calendar className="size-3.5" />
          <span className="hidden lg:inline">Schedule</span>
        </Button>
        <Separator orientation="vertical" className="!h-6" />
        <Button
          size="sm"
          onClick={onPublish}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          <span className="hidden lg:inline">Publish</span>
          <Send className="size-3.5" />
        </Button>
      </div>
    </header>
  )
}

export default CreateHeader

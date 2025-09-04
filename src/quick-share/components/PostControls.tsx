import { Calendar, PencilRuler, RotateCcw, Send } from 'lucide-react'

import { Button } from '@/shared/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

interface PostControlsProps {
  isLoading: boolean
  onRetry: () => void
  onPublish: () => void
  onEdit: () => void
  onSchedule?: () => void
}

function PostControls({
  isLoading,
  onRetry,
  onPublish,
  onEdit,
  onSchedule,
}: PostControlsProps) {
  return (
    <div className="flex gap-2">
      <div className="mr-2 flex gap-2 border-r pr-4">
        {/* Schedule Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" disabled={isLoading} onClick={onSchedule}>
              <Calendar />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Schedule</span>
          </TooltipContent>
        </Tooltip>

        {/* Retry Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" disabled={isLoading} onClick={onRetry}>
              <RotateCcw />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Retry</span>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Edit Button */}
      <Button
        variant="outline"
        className="text-xs"
        disabled={isLoading}
        onClick={onEdit}
      >
        <PencilRuler className="size-3" />
        Edit
      </Button>

      {/* Publish Button */}
      <Button
        variant="default"
        className="text-xs"
        disabled={isLoading}
        onClick={onPublish}
      >
        <Send className="size-3" />
        Publish
      </Button>
    </div>
  )
}

export default PostControls

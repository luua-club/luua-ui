import { Calendar, PencilRuler, RotateCcw, Send } from 'lucide-react'

import { Button } from '@/shared/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

interface GeneratedPostControlsProps {
  isLoading: boolean
  onRetry: () => void
}

const GeneratedPostControls = ({
  isLoading,
  onRetry,
}: GeneratedPostControlsProps) => {
  return (
    <div className="mt-2 flex flex-col items-center justify-between md:flex-row">
      <h2 className="text-2xl font-semibold">Review and Publish</h2>
      <div className="mt-4 flex justify-center gap-1 md:mt-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" disabled={isLoading} className="!p-2">
              <Calendar />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Schedule</span>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" disabled={isLoading} className="!p-2">
              <PencilRuler />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Customize</span>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              disabled={isLoading}
              className="!p-2"
              onClick={onRetry}
            >
              <RotateCcw />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Retry</span>
          </TooltipContent>
        </Tooltip>

        <Button variant="default" disabled={isLoading}>
          <Send className="h-4 w-4" />
          Publish Now
        </Button>
      </div>
    </div>
  )
}

export default GeneratedPostControls

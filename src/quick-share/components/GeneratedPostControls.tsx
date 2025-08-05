import { Calendar, PencilRuler, RotateCcw, Send } from 'lucide-react'

import { Button } from '@/shared/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import { cn } from '@/shared/utils'

interface GeneratedPostControlsProps {
  isLoading: boolean
  onlyControls?: boolean
  onRetry: () => void
  onPublish: () => void
}

const GeneratedPostControls = ({
  isLoading,
  onlyControls = false,
  onRetry,
  onPublish,
}: GeneratedPostControlsProps) => {
  return (
    <>
      <div
        className={cn(
          'flex flex-col items-center justify-between md:flex-row',
          onlyControls ? 'mt-1' : 'mt-2'
        )}
      >
        {!onlyControls && (
          <h2 className="text-2xl font-semibold">Review and Publish</h2>
        )}
        <div
          className={cn(
            'flex justify-center gap-1 md:mt-0',
            onlyControls ? 'mt-1 w-[196px] justify-between' : 'mt-4'
          )}
        >
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

          <Button variant="default" disabled={isLoading} onClick={onPublish}>
            <Send className="h-4 w-4" />
            {onlyControls ? '' : 'Publish'}
          </Button>
        </div>
      </div>
    </>
  )
}

export default GeneratedPostControls

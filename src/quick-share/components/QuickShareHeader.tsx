import { Calendar, PencilRuler, Share2 } from 'lucide-react'

import { Button } from '@/shared/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

const QuickShareHeader = () => {
  return (
    <div className="flex flex-wrap items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold">Review and publish</h2>
        <p className="text-gray-600">Your AI generated post</p>
      </div>

      <div className="mt-5 flex justify-end gap-2 lg:mt-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">
              <Calendar className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Schedule</span>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">
              <Share2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Share</span>
          </TooltipContent>
        </Tooltip>

        <Button variant="default">
          <PencilRuler />
          Customize these posts
        </Button>
      </div>
    </div>
  )
}

export default QuickShareHeader

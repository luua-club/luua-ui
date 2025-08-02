import { Calendar, PencilRuler, Send } from 'lucide-react'

import { Button } from '@/shared/ui/button'
import { LoaderFive } from '@/shared/ui/loader'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

interface QuickShareHeaderProps {
  isLoading: boolean
}

const QuickShareHeader = ({ isLoading }: QuickShareHeaderProps) => {
  if (isLoading) {
    return (
      <div className="flex min-h-9 items-end">
        <LoaderFive text="Hold tight, Luua is generating your posts..." />
      </div>
    )
  }

  return (
    <div className="flex min-h-9 flex-wrap items-center justify-center sm:justify-between">
      <h2 className="text-3xl font-semibold">Review and Publish</h2>

      <div className="mt-5 flex justify-end gap-2 lg:mt-0">
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                disabled={isLoading}
                className="border-black"
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Schedule</span>
            </TooltipContent>
          </Tooltip>

          <Button variant="brandAccent" disabled={isLoading}>
            <Send className="h-4 w-4" />
            Publish Now
          </Button>
        </div>

        <Button variant="default" disabled={isLoading}>
          <PencilRuler />
          <span className="hidden sm:block">Customize these posts</span>
        </Button>
      </div>
    </div>
  )
}

export default QuickShareHeader

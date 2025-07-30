import { SquareArrowOutUpRight } from 'lucide-react'

import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { extractDomain } from '../utils'

interface IExternalResourceChip {
  url: string
  title: string
}

const ExternalResourceChip = ({ url, title }: IExternalResourceChip) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          variant="outline"
          size="lg"
          className="cursor-pointer justify-start border-1 border-dashed px-4 py-6 focus-visible:ring-0"
          onClick={() => window.open(url, '_blank')}
        >
          <div className="max-w-32 flex-1 text-left text-sm">
            <span className="block truncate text-xs font-medium text-gray-400">
              {extractDomain(url)}
            </span>
            <span className="block truncate text-xs font-semibold">
              {title}
            </span>
          </div>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span className="inline-flex items-center gap-1">
          {title} <SquareArrowOutUpRight className="size-3" />
        </span>
      </TooltipContent>
    </Tooltip>
  )
}

export default ExternalResourceChip

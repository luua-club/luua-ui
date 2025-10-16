import { ChevronRight } from 'lucide-react'

import { ExamplePrompt } from '@/core/models/example-prompt.model'
import { channelType } from '@/core/models/social.model'
import { Card, CardContent } from '@/shared/ui/card'
import { cn } from '@/shared/utils'

interface PromptChipProps {
  data: ExamplePrompt
  onChipClick: (data: {
    value: string
    search: boolean
    channel: channelType | null
  }) => void
}

function PromptChip({ data, onChipClick }: PromptChipProps) {
  const handleClick = () => {
    onChipClick({
      value: data.prompt,
      search: data.search ?? false,
      channel: data.social ?? null,
    })
  }

  return (
    <Card
      onClick={handleClick}
      className={cn(
        'bg-card group cursor-pointer border-2 p-2 shadow-none sm:p-3',
        'dark:border-sidebar-accent dark:hover:bg-sidebar-accent border-gray-100 hover:border-gray-200 dark:hover:border-zinc-500'
      )}
    >
      <CardContent className="flex flex-col gap-2 p-0">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2">
            <data.iconData.icon
              className={cn(
                data.iconData.className,
                'size-4',
                'hidden sm:block'
              )}
            />
            <span
              className={cn(
                'text-card-foreground text-xs font-semibold sm:text-sm'
              )}
            >
              {data.title}
            </span>
          </p>
          <ChevronRight className="size-3.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        </div>
        <p
          className={cn(
            'text-muted-foreground line-clamp-2 text-xs font-medium sm:break-all'
          )}
        >
          {data.prompt}
        </p>
      </CardContent>
    </Card>
  )
}

export default PromptChip

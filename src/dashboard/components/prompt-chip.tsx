import { ChevronRight } from 'lucide-react'
import { useCallback, useMemo, useRef } from 'react'

import { ExamplePrompt } from '@/core/models/example-prompt.model'
import { getRandomInt } from '@/core/utils/common.util'
import { Card, CardContent } from '@/shared/ui/card'
import { cn } from '@/shared/utils'

interface PromptChipProps {
  data: ExamplePrompt
  onChipClick: (value: string, search: boolean, channel: string | null) => void
  onHoverPreview?: (prompt: string | null) => void
}

function PromptChip({ data, onChipClick, onHoverPreview }: PromptChipProps) {
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const prompt = useMemo(() => {
    const randomIndex = getRandomInt(0, data.prompt.length - 1)
    return data.prompt[randomIndex]
  }, [data.prompt])

  const handleClick = () => {
    onChipClick(prompt, false, null)
  }

  const handleMouseEnter = useCallback(() => {
    if (!onHoverPreview) return

    // Debounce hover to avoid excessive updates (100ms delay)
    hoverTimeoutRef.current = setTimeout(() => {
      onHoverPreview(prompt)
    }, 100)
  }, [prompt, onHoverPreview])

  const handleMouseLeave = useCallback(() => {
    if (!onHoverPreview) return

    // Clear the timeout if user leaves before delay
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }

    // Clear preview immediately
    onHoverPreview(null)
  }, [onHoverPreview])

  return (
    <Card
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
            <span className={cn('text-xs font-medium sm:text-sm')}>
              {data.title}
            </span>
          </p>
          <ChevronRight className="size-3.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        </div>
        <p
          className={cn(
            'text-muted-foreground group-hover:text-primary sm:break-word line-clamp-2 text-xs leading-5'
          )}
        >
          {prompt}
        </p>
      </CardContent>
    </Card>
  )
}

export default PromptChip

import {
  Bookmark,
  ChartNoAxesColumn,
  CircleAlert,
  CirclePlus,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
} from 'lucide-react'

import { POST_WORD_COUNT } from '@/core/config/constant'
import { AnimatedCircularProgressBar } from '@/shared/ui/animated-circular-progress-bar'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import { cn } from '@/shared/utils'

function TwitterPostCardFooter({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="text-muted-foreground flex items-center justify-between pt-2 text-xs">
        <p className="flex items-center gap-2">
          <MessageCircle className="size-3.5" />
          <Repeat2 className="size-3.5" />
          <Heart className="size-3.5" />
          <ChartNoAxesColumn className="size-3.5" />
        </p>
        <p>Preview stats hidden</p>
      </div>
    )
  }

  return (
    <div className="flex justify-between pt-2">
      {/* Comments */}
      <p className="flex items-center gap-1 text-xs font-medium sm:text-sm">
        <MessageCircle className="size-4 text-blue-600 dark:text-blue-400" />
        <span className="text-muted-foreground hidden sm:inline">220</span>
      </p>

      {/* Retweets */}
      <p className="flex items-center gap-1 text-xs font-medium sm:text-sm">
        <Repeat2 className="size-4.5 text-yellow-500 dark:text-yellow-400" />
        <span className="text-muted-foreground hidden sm:inline">1.7K</span>
      </p>

      {/* Likes */}
      <p className="flex items-center gap-1 text-xs font-medium sm:text-sm">
        <Heart className="size-4 text-red-600 dark:text-red-400" />
        <span className="text-muted-foreground hidden sm:inline">9k</span>
      </p>

      {/* Views */}
      <p className="flex items-center gap-1 text-xs font-medium sm:text-sm">
        <ChartNoAxesColumn className="size-4 text-green-600 dark:text-green-400" />
        <span className="text-muted-foreground hidden sm:inline">513k</span>
      </p>

      {/* Bookmark & Share */}
      <div className="flex items-center gap-1 text-pink-600 dark:text-pink-400">
        <Bookmark className="size-4" />
        <Share className="size-4" />
      </div>
    </div>
  )
}

function TwitterPostCardFooterActions({
  content,
  showUnicodeHint = false,
}: {
  content: string
  showUnicodeHint?: boolean
}) {
  const maxChars = POST_WORD_COUNT.Twitter
  const usedChars = content.length

  // Determine text color based on character count
  const textColor =
    usedChars >= maxChars
      ? 'text-red-600 dark:text-red-400'
      : usedChars >= maxChars * 0.5
        ? 'text-yellow-500 dark:text-yellow-400'
        : ''

  const percentage = Math.round((usedChars / maxChars) * 100)

  // Determine gauge colors based on character count and theme
  const primaryColorLight =
    usedChars >= maxChars
      ? '#dc2626' // Red for light mode
      : usedChars >= maxChars * 0.5
        ? '#eab308' // Yellow for light mode
        : '#22c55e' // Green for light mode

  const primaryColorDark =
    usedChars >= maxChars
      ? '#f87171' // Lighter red for dark mode
      : usedChars >= maxChars * 0.5
        ? '#fbbf24' // Lighter yellow for dark mode
        : '#4ade80' // Lighter green for dark mode

  return (
    <div className="mt-2 flex items-center justify-between gap-2 lg:mt-2">
      {showUnicodeHint ? (
        <p className="flex max-w-[80%] items-center gap-1.5 text-xs text-orange-600">
          Note: Bold or styled text may not be read the same way by search. If
          visibility matters, keep important words in normal text.
        </p>
      ) : (
        <span />
      )}

      <div className="flex items-center gap-2">
        {/* Light mode gauge */}
        <AnimatedCircularProgressBar
          max={100}
          min={0}
          value={percentage}
          gaugePrimaryColor={primaryColorLight}
          gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
          className="size-4 dark:hidden [&>span]:hidden"
        />
        {/* Dark mode gauge */}
        <AnimatedCircularProgressBar
          max={100}
          min={0}
          value={percentage}
          gaugePrimaryColor={primaryColorDark}
          gaugeSecondaryColor="rgba(255, 255, 255, 0.15)"
          className="hidden size-4 dark:block [&>span]:hidden"
        />
        <p className={cn('text-xs', textColor)}>
          {usedChars}/{maxChars}
        </p>

        <div className="flex items-center gap-1">
          <Separator orientation="vertical" className="!h-4" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="size-6">
                <CirclePlus />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Threads coming soon !</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export { TwitterPostCardFooter, TwitterPostCardFooterActions }

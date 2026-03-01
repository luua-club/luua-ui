import {
  Dot,
  Heart,
  MessageCircleMore,
  Repeat2,
  Send,
  Smile,
  ThumbsUp,
} from 'lucide-react'

import { POST_WORD_COUNT } from '@/core/config/constant'
import { AnimatedCircularProgressBar } from '@/shared/ui/animated-circular-progress-bar'
import { cn } from '@/shared/utils'

function LinkedInPostCardFooter({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center justify-between px-4 pt-2 pb-3 text-xs">
        <p className="flex items-center gap-1.5">
          <ThumbsUp className="size-3.5" />
          <MessageCircleMore className="size-3.5" />
          <Repeat2 className="size-3.5" />
          <Send className="size-3.5" />
        </p>
        <p>Preview stats hidden</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 px-4 pt-2 pb-4">
      <div className="flex items-center justify-between">
        {/* Impressions */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <div className="rounded-full border-1 border-dotted bg-blue-200 p-1 dark:bg-blue-300 dark:text-black">
              <ThumbsUp className="size-2 sm:size-3" />
            </div>
            <div className="rounded-full border-1 border-dotted bg-red-200 p-1 dark:bg-red-300 dark:text-black">
              <Heart className="size-2 sm:size-3" />
            </div>
            <div className="rounded-full border-1 border-dotted bg-yellow-200 p-1 dark:bg-yellow-300 dark:text-black">
              <Smile className="size-2 sm:size-3" />
            </div>
          </div>
          <p className="text-xs sm:text-xs">22,636</p>
        </div>

        {/* Stats */}
        <p className="flex items-center text-xs sm:text-xs">
          745 comments <Dot className="size-2 sm:size-3" /> 229 reposts
        </p>
      </div>
      <hr />

      {/* Actions */}
      <div className="flex justify-around">
        <p className="flex items-center gap-1 text-xs">
          <ThumbsUp className="size-4" />
          <span className="hidden sm:inline">Like</span>
        </p>
        <p className="flex items-center gap-1 text-xs">
          <MessageCircleMore className="size-4" />
          <span className="hidden sm:inline">Comment</span>
        </p>
        <p className="flex items-center gap-1 text-xs">
          <Repeat2 className="size-4" />
          <span className="hidden sm:inline">Repost</span>
        </p>
        <p className="flex items-center gap-1 text-xs">
          <Send className="size-4" />
          <span className="hidden sm:inline">Send</span>
        </p>
      </div>
    </div>
  )
}

function LinkedInPostCardFooterActions({
  content,
  showUnicodeHint = false,
}: {
  content: string
  showUnicodeHint?: boolean
}) {
  const maxChars = POST_WORD_COUNT.LinkedIn
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
      </div>
    </div>
  )
}

export { LinkedInPostCardFooter, LinkedInPostCardFooterActions }

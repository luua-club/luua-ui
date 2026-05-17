import { type ReactNode, useState } from 'react'

import { cn } from '@/shared/utils'

const CONTENT_THRESHOLD = 250

interface SeeMoreContentProps {
  content: string
  children: ReactNode
  collapsedMaxHeight?: number
}

export function SeeMoreContent({
  content,
  children,
  collapsedMaxHeight = 200,
}: SeeMoreContentProps) {
  const [expanded, setExpanded] = useState(false)
  const isLong = content.length > CONTENT_THRESHOLD

  if (!isLong) return <>{children}</>

  return (
    <>
      <div
        className={cn('relative', !expanded && 'overflow-hidden')}
        style={!expanded ? { maxHeight: collapsedMaxHeight } : undefined}
      >
        {children}
        {!expanded && (
          <div className="to-card pointer-events-none absolute right-0 bottom-0 left-0 h-12 bg-gradient-to-b from-transparent" />
        )}
      </div>
      <button
        type="button"
        className="mt-1 ml-auto block text-xs font-medium text-blue-600 dark:text-blue-300"
        onClick={() => setExpanded(prev => !prev)}
      >
        {expanded ? '...see less' : '...see more'}
      </button>
    </>
  )
}

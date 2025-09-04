import { formatDate } from 'date-fns'
import { History, RotateCcw } from 'lucide-react'

import Post from '@/core/components/Post'
import { Button } from '@/shared/ui/button'
import { TabsContent } from '@/shared/ui/tabs'

import { HistoryEntry } from '../hooks/quick-share.hook'

interface TabHistoryContentProps {
  history: HistoryEntry[]
  onRollback: (index: number) => void
  onSwitchToPosts: () => void
}

function TabHistoryContent({
  history,
  onRollback,
  onSwitchToPosts,
}: TabHistoryContentProps) {
  // ---- Functions ----
  /**
   * Handles the rollback action for a specific history entry.
   *
   * @param index The index of the history entry to rollback to.
   */
  const handleRollback = (index: number) => {
    onRollback(index)
    onSwitchToPosts()
  }

  return (
    <TabsContent
      value="history"
      className="mx-auto flex w-full max-w-4xl flex-col gap-3"
    >
      {/* Heading */}
      <h2 className="mt-2 mb-6 flex items-center gap-2 text-2xl font-semibold">
        <History />
        History
      </h2>

      {/* No History */}
      {history.length === 0 && (
        <p className="text-muted-foreground text-base">
          No history yet. Generate some posts to see them here.
        </p>
      )}

      <div className="flex flex-col gap-10">
        {history.map((entry, idx) => (
          <div
            key={entry.id}
            className="bg-card relative flex flex-col gap-4 rounded-md border p-3"
          >
            {/* Rollback Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRollback(idx)}
              className="!bg-card absolute -top-6 -right-5 text-xs"
            >
              <RotateCcw className="size-3" />
              Rollback
            </Button>

            {/* Date */}
            <p className="text-muted-foreground absolute -top-6 left-0 text-xs">
              {formatDate(entry.createdAt, 'h:mm:ss a')}
            </p>

            {/* Prompt */}
            <p className="line-clamp-3 text-sm font-medium">{entry.prompt}</p>

            {/* Posts */}
            <div
              className={`grid grid-cols-1 gap-4 lg:grid-cols-${entry.posts.length > 1 ? '2' : '1'}`}
            >
              {entry.posts.map(post => (
                <Post {...post} key={post.id} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </TabsContent>
  )
}

export default TabHistoryContent

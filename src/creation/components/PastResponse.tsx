import { formatDate } from 'date-fns'
import { History } from 'lucide-react'

import Post from '@/core/components/Post'
import { IPost } from '@/core/models/post.model'

export interface HistoryEntry {
  prompt: string
  createdAt: string
  posts: Pick<IPost, 'id' | 'channel' | 'content'>[]
}

interface PastResponseProps {
  history: HistoryEntry[]
}

function PastResponse({ history }: PastResponseProps) {
  return (
    <div className="m-auto flex max-w-4xl flex-col p-5 pt-1">
      {/* Heading */}
      <h2 className="mt-2 mb-4 flex items-center gap-2 text-xl font-semibold">
        <History />
        Post Iterations
      </h2>

      {/* No History */}
      {history.length === 0 && (
        <p className="text-muted-foreground text-sm">
          No iterations yet — start creating to see variations.
        </p>
      )}

      <div className="mt-2 flex flex-col gap-8">
        {history.map(entry => (
          <div className="mt-4 flex flex-col" key={entry.createdAt}>
            {/* Date */}
            <p className="text-muted-foreground text-xs font-semibold">
              {formatDate(entry.createdAt, 'h:mm:ss a')}
            </p>

            {/* Prompt */}
            <p className="mt-1 line-clamp-3 text-sm font-medium">
              {entry.prompt}
            </p>

            {/* Posts */}
            <div
              className={`mt-4 grid grid-cols-1 gap-4 lg:grid-cols-${entry.posts.length > 1 ? '2' : '1'}`}
            >
              {entry.posts.map(post => (
                <Post {...post} key={post.id} maintainFormatting />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PastResponse

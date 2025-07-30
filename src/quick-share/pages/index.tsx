import { createLazyRoute, Link } from '@tanstack/react-router'
import { ChevronLeft, RotateCcw } from 'lucide-react'

import Post from '@/core/components/Post'
import { FloatingPromptInput } from '@/core/containers/PromptInput'
import mockRecentPost from '@/core/mocks/recent-post.json'
import { IPost } from '@/core/models/post.model'
import ExternalResourceChip from '@/shared/components/external-resource-chip'
import { Button } from '@/shared/ui/button'

import QuickShareHeader from '../components/QuickShareHeader'

//TODO: GET DATA FROM CONTEXT IF NO DATA THEN REDIRECT TO DASHBOARD
const QuickShare = () => {
  const recentPost: IPost[] = [mockRecentPost as IPost, mockRecentPost as IPost]

  return (
    <>
      <div className="m-auto flex max-w-4xl flex-col p-5">
        <Link to="/dashboard">
          <Button variant="link" className="mb-6 w-fit !p-0">
            <ChevronLeft className="size-3" />
            Dashboard
          </Button>
        </Link>

        {/* Header */}
        <QuickShareHeader />

        {/* Posts */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {recentPost.map(post => (
            <Post
              id={post.id}
              key={post.id}
              channel={post.channel}
              content={post.content}
              attachedMedia={post.attachedMedia}
              status={post.status}
              created_at={post.created_at}
              updated_at={post.updated_at}
            />
          ))}
        </div>
      </div>
      <FloatingPromptInput
        btnText="Regenerate Post"
        btnIcon={<RotateCcw className="size-3" />}
        preFilledValue="Generate me a post where I talk about my newly shipped component for library shadcn/ui"
      >
        <div className="mb-4 flex flex-wrap gap-2">
          <ExternalResourceChip
            url="https://en.wikipedia.org/wiki/2025_Cambodia%E2%80%93Thailand_clashes"
            title="Cambodia Thailand clashes - Wikipedia"
          />
          <ExternalResourceChip
            url="https://en.wikipedia.org/wiki/2025_Cambodia%E2%80%93Thailand_clashes"
            title="Cambodia Thailand clashes - Wikipedia"
          />
        </div>
      </FloatingPromptInput>
    </>
  )
}

export const Route = createLazyRoute('/quick-share')({
  component: QuickShare,
})

export default QuickShare

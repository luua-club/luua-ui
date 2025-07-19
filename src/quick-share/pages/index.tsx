import { createLazyRoute, Link } from '@tanstack/react-router'
import {
  Calendar,
  ChevronLeft,
  PencilRuler,
  RotateCcw,
  Share2,
} from 'lucide-react'

import Post from '@/core/components/Post'
import PromptInput from '@/core/containers/PromptInput'
import mockRecentPost from '@/core/mocks/recent-post.json'
import { IPost } from '@/core/models/post.model'
import { Button } from '@/shared/ui/button'

//TODO: GET DATA FROM CONTEXT IF NO DATA THEN REDIRECT TO DASHBOARD,
//NOTE: CALL API IN DASHBOARD AND STORE IN CONTEXT
const QuickShare = () => {
  const recentPost: IPost[] = [mockRecentPost as IPost, mockRecentPost as IPost]

  return (
    <div className="m-auto flex max-w-4xl flex-col p-5">
      {/* Back to Dashboard */}
      <Link to="/dashboard">
        <Button variant="link" className="w-fit !p-0">
          <ChevronLeft className="size-3" />
          Dashboard
        </Button>
      </Link>

      {/* Prompt Section */}
      <div className="mt-6 space-y-1">
        <h1 className="text-2xl font-semibold">Your prompt</h1>
        <PromptInput
          btnText="Regenerate Post"
          btnIcon={<RotateCcw className="size-3" />}
          preFilledValue="Generate me a post where I talk about my newly shipped component for library shadcn/ui"
        />
      </div>

      {/* Review and Publish Section */}
      <div className="mt-12 space-y-6">
        <div className="flex flex-wrap items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Review and publish</h2>
            <p className="text-gray-600">Your AI generated post</p>
          </div>
          <Button variant="default" className="mt-4 gap-2 lg:mt-0">
            <PencilRuler />
            Customize these posts
          </Button>
        </div>

        {/* Post Cards Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Schedule
          </Button>
          <Button variant="brandAccent" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share All
          </Button>
        </div>
      </div>
    </div>
  )
}

export const Route = createLazyRoute('/quick-share')({
  component: QuickShare,
})

export default QuickShare

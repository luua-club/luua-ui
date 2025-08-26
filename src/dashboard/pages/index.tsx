import { createLazyRoute } from '@tanstack/react-router'
import { useRouter } from '@tanstack/react-router'
import { Play } from 'lucide-react'

import Post from '@/core/components/Post'
import { PromptInput } from '@/core/components/PromptInput'
import { useAppDispatch } from '@/core/hooks/global-state.hook'
import { useUserState } from '@/core/hooks/user-state.hook'
import mockRecentPost from '@/core/mocks/recent-post.json'
import { IPost } from '@/core/models/post.model'
import { setPrompt } from '@/core/store/prompt-slice'
import { SOCIAL_STATUS } from '@/shared/config/constant'
import { Button } from '@/shared/ui/button'

const Dashboard = () => {
  const dispatch = useAppDispatch()
  const userState = useUserState()
  const router = useRouter()

  const recentPost: IPost[] = [mockRecentPost as IPost]

  const handleUserPrompt = (value: string) => {
    dispatch(setPrompt(value))
    router.navigate({ to: '/quick-share' })
  }

  const getSocialStatus = () => {
    if (!userState || !userState.connected_channels) {
      return SOCIAL_STATUS.WARNING
    }

    if (
      userState.connected_channels.linkedin?.connected ||
      userState.connected_channels.twitter?.connected
    ) {
      return SOCIAL_STATUS.OK
    }

    return SOCIAL_STATUS.WARNING
  }

  return (
    <div className="m-auto flex max-w-7xl flex-col gap-8 p-5 lg:flex-row lg:gap-16">
      {/* Left column: User prompt + Recent Posts */}
      <div className="flex w-full flex-col gap-8 lg:w-2/3">
        {/* User prompt */}
        <div>
          <h2 className="pb-4 text-2xl text-gray-800">Ready when you are.</h2>
          <PromptInput
            onChange={handleUserPrompt}
            socialStatus={getSocialStatus()}
          />
          <div className="mt-4 flex w-full items-center justify-end gap-2">
            <p className="text-sm text-gray-600">Not sure where to start ? </p>
            <Button variant="brandAccent" size="sm">
              Create New
              <Play />
            </Button>
          </div>
        </div>
        {/* Recent Posts */}
        <div className="rounded-lg">
          <h2 className="pb-4 text-2xl text-gray-800">Recent Posts</h2>
          {recentPost && recentPost.length === 0 ? (
            <div className="flex w-full items-center justify-center rounded-lg border border-dashed p-5">
              <p className="text-sm text-gray-500">
                Seems Empty, Create new post to get started.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {recentPost.map(post => (
                <Post
                  id={post.id}
                  key={post.id}
                  channel={post.channel}
                  content={post.content}
                  attached_media={post.attached_media}
                  status={post.status}
                  created_at={post.created_at}
                  updated_at={post.updated_at}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Right column: Placeholder for future component */}
      <div className="flex min-h-[400px] w-full flex-shrink-0 flex-col rounded-lg lg:w-1/3">
        {/* Content for the second column (to be added later) */}
      </div>
    </div>
  )
}

export const Route = createLazyRoute('/dashboard')({
  component: Dashboard,
})

export default Dashboard

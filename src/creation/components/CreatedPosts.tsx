import LinkedInPost from '@/core/components/post-preview/LinkedInPost'
import TwitterPost from '@/core/components/post-preview/TwitterPost'
import { SOCIAL_PLATFORM } from '@/core/config/constant'
import { PostPreviewProps } from '@/core/models/post.model'
import { channelType } from '@/core/models/social.model'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'

import { PostDraftsType } from '../hooks/create-draft.hook'

// Post props for the post component
interface PostProps {
  handleContentChange: (val: string, name: channelType) => void
  postDrafts: PostDraftsType
  loading: boolean
  isActionLoading: boolean
  handlePostDelete: (postId?: string) => void
}

// Create tab content props
interface CreatedPostsProps {
  post: PostProps
  allSocialTabs: channelType[]
  activeTab: channelType
  setActiveTab: (tab: channelType) => void
}

// Tabs and post fixed values
const POST_COMPONENTS: Record<
  channelType,
  React.ComponentType<PostPreviewProps>
> = {
  LinkedIn: LinkedInPost,
  Twitter: TwitterPost,
}

function CreatedPosts({
  post,
  allSocialTabs,
  activeTab,
  setActiveTab,
}: CreatedPostsProps) {
  return (
    <Tabs
      className="w-full"
      value={activeTab}
      onValueChange={value => setActiveTab(value as channelType)}
    >
      <TabsList className="mx-auto w-fit rounded-full px-1.5 py-4">
        {allSocialTabs.map(tab => {
          const Logo = SOCIAL_PLATFORM.find(s => s.name === tab)?.logo
          return (
            <TabsTrigger
              key={tab}
              value={tab}
              className="rounded-full px-2 py-3 text-xs"
            >
              {Logo && <Logo className="size-4" />} {tab}
            </TabsTrigger>
          )
        })}
      </TabsList>

      {allSocialTabs.map(tab => {
        const PostComponent = POST_COMPONENTS[tab]
        return (
          <TabsContent key={tab} value={tab}>
            <div className="mx-auto mt-2 max-w-2xl">
              <PostComponent
                onContentChange={val =>
                  post.handleContentChange(val, activeTab)
                }
                initialContent={post.postDrafts[activeTab]?.content}
                loading={post.loading}
                isActionLoading={post.isActionLoading}
                handlePostDelete={() =>
                  post.handlePostDelete(post.postDrafts[activeTab]?.id)
                }
              />
            </div>
          </TabsContent>
        )
      })}
    </Tabs>
  )
}

export default CreatedPosts

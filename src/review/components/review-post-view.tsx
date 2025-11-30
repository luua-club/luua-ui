import { ChevronRight, Loader } from 'lucide-react'

import Post from '@/core/components/Post'
import { PostItem } from '@/core/models/draft.model'
import { Checkbox } from '@/shared/ui/checkbox'
import { Label } from '@/shared/ui/label'

interface ReviewPostViewProps {
  posts: PostItem[]
  isLoading: boolean
  selectedPosts: PostItem[]
  onSelectionChange: (posts: PostItem[]) => void
}

function ReviewPostView({
  posts,
  isLoading,
  selectedPosts,
  onSelectionChange,
}: ReviewPostViewProps) {
  const togglePost = (post: PostItem, checked: boolean | string) => {
    if (checked === true) {
      onSelectionChange([...selectedPosts, post])
    } else {
      onSelectionChange(selectedPosts.filter(p => p.id !== post.id))
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="flex items-center gap-1 text-lg font-semibold">
          Select your posts <ChevronRight className="size-5" />
        </h2>
        <p className="text-muted-foreground text-sm font-medium text-balance">
          Here&apos;s your final post preview. Select the posts you want to
          publish, only the selected ones will go live. The rest (if any) will
          stay in your drafts.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader className="size-5 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {posts.map(post => (
            <div
              key={post.id}
              className={
                selectedPosts.some(p => p.id === post.id) ? '' : 'opacity-50'
              }
            >
              <div className="mb-2 flex items-center gap-2">
                <Checkbox
                  id={`post-${post.id}`}
                  className="size-5 cursor-pointer shadow-lg"
                  checked={selectedPosts.some(p => p.id === post.id)}
                  onCheckedChange={checked => {
                    togglePost(post, checked)
                  }}
                  onClick={e => e.stopPropagation()}
                />
                <Label
                  htmlFor={`post-${post.id}`}
                  className="cursor-pointer text-sm font-bold"
                >
                  {post.channel.toUpperCase()}
                </Label>
              </div>

              <Post
                id={post.id}
                channel={post.channel}
                content={post.content}
                maintainFormatting
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReviewPostView

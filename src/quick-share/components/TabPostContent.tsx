import { IconSkull } from '@tabler/icons-react'
import { RotateCcw } from 'lucide-react'

import LinkedInPost, {
  LinkedInPostSkeleton,
} from '@/core/components/post-preview/LinkedInPost'
import TwitterPost, {
  TwitterPostSkeleton,
} from '@/core/components/post-preview/TwitterPost'
import { IPost } from '@/core/models/post.model'
import ExternalResourceChip from '@/shared/components/external-resource-chip'
import { Button } from '@/shared/ui/button'
import { TabsContent } from '@/shared/ui/tabs'
import { cn } from '@/shared/utils'

interface TabPostContentProps {
  extractedLinks: { url: string; content: string }[]
  loading: boolean
  activeChannels: string | null | undefined
  isGeneratedDataFetching: boolean
  posts: Pick<IPost, 'content' | 'id' | 'channel'>[]
  error: Error | null
  refetch: () => void
}

function TabPostContent({
  extractedLinks,
  loading,
  activeChannels,
  isGeneratedDataFetching,
  posts,
  error,
  refetch,
}: TabPostContentProps) {
  const channels = posts.length > 1 ? null : activeChannels

  return (
    <TabsContent value="created-post" className="flex flex-col">
      <div className="mx-auto mt-4 flex flex-col gap-4 lg:w-5xl">
        {/** Floating Extracted Sources */}
        {extractedLinks.length > 0 && !loading && (
          <div className="hidden w-full gap-2 lg:flex lg:justify-center">
            {extractedLinks.slice(0, 5).map(link_data => (
              <div key={link_data.url} className="max-w-52 flex-1">
                <ExternalResourceChip
                  url={link_data.url}
                  title={link_data.content}
                />
              </div>
            ))}
          </div>
        )}

        {/* Posts */}
        <div
          className={cn(
            'mx-auto mt-2 grid w-full grid-cols-1 gap-6 lg:grid-cols-2',
            channels && 'lg:w-xl lg:grid-cols-1'
          )}
        >
          {isGeneratedDataFetching ? (
            <>
              {(!channels || channels === 'LinkedIn') && (
                <LinkedInPostSkeleton />
              )}
              {(!channels || channels === 'Twitter') && <TwitterPostSkeleton />}
            </>
          ) : (
            posts.map(post => {
              if (post.channel === 'LinkedIn') {
                return (
                  <LinkedInPost
                    key={post.id}
                    initialContent={post.content}
                    loading={isGeneratedDataFetching}
                    notEditable
                  />
                )
              }
              return (
                <TwitterPost
                  key={post.id}
                  initialContent={post.content}
                  loading={isGeneratedDataFetching}
                  notEditable
                />
              )
            })
          )}
        </div>

        {/** Error */}
        {error && posts.length === 0 && (
          <p className="text-card-foreground flex flex-col items-center justify-center gap-4 pt-10 font-semibold">
            <span className="flex items-center gap-2">
              <IconSkull /> Something went wrong please !
            </span>
            <span>
              <Button
                variant="destructive"
                onClick={() => refetch()}
                className="px-2 py-1 text-sm"
              >
                <RotateCcw className="size-3" />
                Retry
              </Button>
            </span>
          </p>
        )}
      </div>
    </TabsContent>
  )
}

export default TabPostContent

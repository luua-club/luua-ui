import { createLazyRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useCallback, useState } from 'react'

import LinkedInPostCard from '@/core/components/post-card/linkedin-post-card'
import TwitterPostCard from '@/core/components/post-card/twitter-post-card'
import { MediaObject } from '@/core/models/post.model'
import type { channelType } from '@/core/models/social.model'
import { Button } from '@/shared/ui/button'

import CreateHeader from './components/create-header'
import { CreateHeaderOptions } from './components/create-header-options'

type SocialTab = channelType | 'all'

type PostDrafts = Partial<
  Record<channelType, { content: string; images: MediaObject[] }>
>

function Create() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<SocialTab>('all')
  const [postDrafts, setPostDrafts] = useState<PostDrafts>({})

  const handleContentChange = useCallback(
    (val: string, channel: channelType) => {
      setPostDrafts(prev => ({
        ...prev,
        [channel]: { ...(prev[channel] ?? { images: [] }), content: val },
      }))
    },
    []
  )

  const handleImagesChange = useCallback(
    (images: MediaObject[], channel: channelType) => {
      setPostDrafts(prev => ({
        ...prev,
        [channel]: { ...(prev[channel] ?? { content: '' }), images },
      }))
    },
    []
  )

  const showLinkedIn = activeTab === 'all' || activeTab === 'LinkedIn'
  const showTwitter = activeTab === 'all' || activeTab === 'Twitter'

  return (
    <div className="bg-secondary dark:bg-background flex h-full min-h-screen flex-col">
      <CreateHeader
        title="The SEO strategy that made Google's CEO ..."
        updatedAt="Updated less than a minute ago"
      />

      <CreateHeaderOptions onChange={setActiveTab} />

      <div className="relative flex-1 p-4">
        <Button
          variant="link"
          size="sm"
          className="absolute top-2 left-2 text-xs"
          onClick={() => navigate({ to: '/dashboard' })}
        >
          <ArrowLeft className="size-3" />
          Dashboard
        </Button>

        <div className="mx-auto mt-8 flex max-w-5xl gap-4">
          {showLinkedIn && (
            <div
              className={
                activeTab === 'all' ? 'flex-1' : 'mx-auto w-full max-w-2xl'
              }
            >
              <LinkedInPostCard
                loading={false}
                initialContent={postDrafts.LinkedIn?.content}
                initialImages={postDrafts.LinkedIn?.images}
                onContentChange={val => handleContentChange(val, 'LinkedIn')}
                onImagesChange={images =>
                  handleImagesChange(images, 'LinkedIn')
                }
              />
            </div>
          )}

          {showTwitter && (
            <div
              className={
                activeTab === 'all' ? 'flex-1' : 'mx-auto w-full max-w-2xl'
              }
            >
              <TwitterPostCard
                loading={false}
                initialContent={postDrafts.Twitter?.content}
                initialImages={postDrafts.Twitter?.images}
                onContentChange={val => handleContentChange(val, 'Twitter')}
                onImagesChange={images => handleImagesChange(images, 'Twitter')}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const Route = createLazyRoute('/create')({
  component: Create,
})

export default Create

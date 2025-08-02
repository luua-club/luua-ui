import { createLazyRoute, Link, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'

import { generateApi } from '@/core/api/generate-post.api'
import Post from '@/core/components/Post'
import { FloatingPromptInput } from '@/core/components/PromptInput'
import { useAppSelector } from '@/core/hooks/global-state.hook'
import { IPost } from '@/core/models/post.model'
import ExternalResourceChip from '@/shared/components/external-resource-chip'
import { Button } from '@/shared/ui/button'

import QuickShareHeader from '../components/QuickShareHeader'

//TODO: GET DATA FROM CONTEXT IF NO DATA THEN REDIRECT TO DASHBOARD
const QuickShare = () => {
  const preUserPrompt = useAppSelector(state => state.promptState.prompt)
  const navigate = useNavigate()
  const [recentPost, setRecentPost] = useState<
    Pick<IPost, 'id' | 'channel' | 'content'>[]
  >([])

  useEffect(() => {
    if (preUserPrompt) {
      handleGeneratePost(preUserPrompt)
    } else {
      navigate({ to: '/dashboard' })
    }
  }, [preUserPrompt])

  const handleGeneratePost = async (value: string) => {
    try {
      const response = await generateApi.generatePost({
        user_prompt: value,
      })
      setRecentPost([
        {
          id: '0',
          channel: 'Linkedin',
          content: response.data.generated_linkedin_post.content,
        },
        {
          id: '1',
          channel: 'X',
          content: response.data.generated_twitter_post.content,
        },
      ])
    } catch (error) {
      console.log(error, 'from quick share')
    }
  }

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
        <div className="mt-8 grid grid-cols-1 gap-6 pb-72 lg:grid-cols-2">
          {recentPost.map(post => (
            <Post
              id={post.id}
              key={post.id}
              channel={post.channel}
              content={post.content}
            />
          ))}
        </div>
      </div>

      {/* Floating Prompt Input */}
      <FloatingPromptInput
        btnText="Regenerate Post"
        btnIcon={<RotateCcw className="size-3" />}
        preFilledValue={preUserPrompt || ''}
        onChange={handleGeneratePost}
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

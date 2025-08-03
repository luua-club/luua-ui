import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { generateApi } from '../api/generate-post.api'
import { extractedLinksType } from '../models/generate-post.model'
import { IPost } from '../models/post.model'

export const useGeneratePosts = (initialPrompt: string) => {
  const [userPrompt, setUserPrompt] = useState(initialPrompt)

  const activePrompt = userPrompt || initialPrompt || ''
  const key = 'generate-ai-post'

  const query = useQuery({
    queryKey: [key, activePrompt],
    queryFn: ({ signal }) =>
      generateApi.generatePost({ user_prompt: activePrompt }, signal),
    enabled: !!activePrompt,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: false,
  })

  const posts: Pick<IPost, 'id' | 'channel' | 'content'>[] = query.data?.data
    ? [
        {
          id: '0',
          channel: 'Linkedin',
          content: query.data.data.generated_linkedin_post.content,
        },
        {
          id: '1',
          channel: 'X',
          content: query.data.data.generated_twitter_post.content,
        },
      ]
    : []

  const extractedLinks: extractedLinksType[] =
    query.data?.data.extracted_links ?? []

  return {
    ...query,
    posts,
    extractedLinks,
    activePrompt,
    key,
    setUserPrompt,
  }
}

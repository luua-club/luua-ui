import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { generateApi } from '../api/generate-post.api'
import { extractedLinksType } from '../models/generate-post.model'
import { IPost } from '../models/post.model'

export const useGeneratePosts = (initialPrompt: string) => {
  const [userPrompt, setUserPrompt] = useState(initialPrompt)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const activePrompt = userPrompt || initialPrompt || ''
  const key = 'generate-ai-post'

  const query = useQuery({
    queryKey: [key, activePrompt],
    queryFn: ({ signal }) =>
      generateApi.generatePost(
        {
          user_prompt: activePrompt,
          is_search_enabled: true,
          ...(sessionId ? { session_id: sessionId } : {}),
        },
        signal
      ),
    enabled: !!activePrompt,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: false,
  })

  useEffect(() => {
    if (query.data?.data.session_id) {
      setSessionId(query.data.data.session_id)
    }
  }, [query.data?.data.session_id])

  const posts: Pick<IPost, 'id' | 'channel' | 'content'>[] = query.data?.data
    ? [
        {
          id: '0',
          channel: 'LinkedIn',
          content: query.data.data.generated_linkedin_post.content,
        },
        {
          id: '1',
          channel: 'Twitter',
          content: query.data.data.generated_twitter_post.content,
        },
      ]
    : []

  const extractedLinks: extractedLinksType[] =
    query.data?.data.external_sources ?? []

  return {
    ...query,
    posts,
    extractedLinks,
    activePrompt,
    key,
    setUserPrompt,
  }
}

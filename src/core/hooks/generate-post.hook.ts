import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'

import { generateApi } from '../api/generate-post.api'
import { QUERY_KEYS } from '../config/constant'
import { extractedLinksType } from '../models/generate-post.model'
import { IPost } from '../models/post.model'
import { channelType } from '../models/social.model'

export const useGeneratePosts = (
  initialPrompt: string,
  initialSearch?: boolean,
  initialChannel?: channelType | null
) => {
  const [userPrompt, setUserPrompt] = useState(initialPrompt)
  const [userSearch, setUserSearch] = useState<boolean | undefined>(
    initialSearch
  )
  const [userChannel, setUserChannel] = useState<
    channelType | null | undefined
  >(initialChannel)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const activePrompt = userPrompt || initialPrompt || ''
  const activeSearch = userSearch ?? initialSearch ?? false
  const activeChannel = userChannel ?? initialChannel ?? null
  const key = QUERY_KEYS.generateAIPost

  const query = useQuery({
    // Excluding sessionId to avoid re-fetch when it's set after first response
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [key, activePrompt, activeSearch, activeChannel],
    queryFn: ({ signal }) =>
      generateApi.generatePost(
        {
          user_prompt: activePrompt,
          is_search_enabled: activeSearch,
          ...(activeChannel ? { post_channels: [activeChannel] } : {}),
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

  const posts: Pick<IPost, 'id' | 'channel' | 'content'>[] = useMemo(
    () =>
      query.data?.data
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
        : [],
    [query.data?.data]
  )

  const extractedLinks: extractedLinksType[] =
    query.data?.data.external_sources ?? []

  return {
    ...query,
    posts,
    extractedLinks,
    activePrompt,
    key,
    setSessionId,
    setUserPrompt,
    setUserSearch,
    setUserChannel,
  }
}

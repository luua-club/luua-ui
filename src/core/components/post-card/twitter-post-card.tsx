import { useEffect } from 'react'

import { usePostCardComposer } from '@/core/hooks/post-card-composer.hook'
import { useUserState } from '@/core/hooks/user-state.hook'
import { extractUserInitial } from '@/core/utils/common.util'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Textarea } from '@/shared/ui/textarea'
import { cn } from '@/shared/utils'

import PostCardActions from './post-card-actions'
import {
  TwitterPostCardFooter,
  TwitterPostCardFooterActions,
} from './twitter-post-card-footer'
import TwitterPostCardHeader from './twitter-post-card-header'
import TwitterPostCardSkeleton from './twitter-post-card-skeleton'

export interface TwitterPostCardProps {
  // Content
  initialContent?: string
  onContentChange?: (content: string) => void

  // Loading states
  loading: boolean
  isActionLoading?: boolean
}

function TwitterPostCard(props: TwitterPostCardProps) {
  // --- Hooks ---
  const user = useUserState()
  const { content, setContent, textareaRef, updateSelectionRef, addEmoji } =
    usePostCardComposer()

  // --- Effects ---
  /**
   * Sets initial content if provided
   */
  useEffect(() => {
    if (typeof props.initialContent === 'string') {
      setContent(props.initialContent)
    }
  }, [props.initialContent, setContent])

  // --- Early Returns ---
  if (!user || props.loading) {
    return <TwitterPostCardSkeleton />
  }

  // --- Computed Variables ---
  const user_social = { ...user.connected_channels.linkedin }
  user_social.user_name = user_social.user_name || user.name
  user_social.user_id = user_social.user_id || user.email
  user_social.user_profile_picture =
    user_social.user_profile_picture || user.profile_image

  return (
    <div className="relative">
      {/* Actions */}
      {!props.isActionLoading && (
        <div className="lg:absolute lg:top-0 lg:-right-9">
          <PostCardActions onEmojiSelect={addEmoji} />
        </div>
      )}

      {/* Post Card */}
      <div
        className={cn(
          'bg-card relative flex h-fit gap-2 rounded-lg border-1 p-4',
          props.isActionLoading && 'opacity-50'
        )}
      >
        {/* Avatar */}
        <Avatar className="!h-10 !w-10 md:!h-12 md:!w-12">
          <AvatarImage
            src={user_social.user_profile_picture}
            alt={user_social.user_name}
          />
          <AvatarFallback>
            {extractUserInitial(user_social.user_name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <TwitterPostCardHeader user={user_social} />

          {/* Text area */}
          <div className="pt-1 pb-2">
            <Textarea
              className={cn(
                'min-h-52 resize-none text-sm md:min-h-28',
                'border-1 border-dashed',
                'caret-primary selection:bg-black selection:text-white',
                'dark:selection:bg-white dark:selection:text-black',
                'transition-colors duration-200',
                'focus:border-1 focus:shadow-none focus:ring-0 focus:outline-none',
                'focus-visible:border-1 focus-visible:border-dashed focus-visible:shadow-none focus-visible:ring-0'
              )}
              placeholder="Your post starts here — Type or ask AI to help..."
              ref={textareaRef}
              autoFocus
              value={content}
              maxLength={3000}
              onChange={e => {
                const val = e.target.value
                setContent(val)
                props.onContentChange?.(val)
              }}
              onSelect={updateSelectionRef}
              onKeyUp={updateSelectionRef}
              onClick={updateSelectionRef}
              disabled={props.isActionLoading}
            />
          </div>

          {/* Cosmetic Footer */}
          <TwitterPostCardFooter />
        </div>
      </div>

      {/* Footer Actions */}
      <TwitterPostCardFooterActions content={content} />
    </div>
  )
}

export default TwitterPostCard

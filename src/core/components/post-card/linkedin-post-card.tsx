import { useEffect } from 'react'

import { Textarea } from '@/shared/ui/textarea'
import { cn } from '@/shared/utils'

import { usePostCardComposer } from '../../hooks/post-card-composer.hook'
import { useUserState } from '../../hooks/user-state.hook'
import {
  LinkedInPostCardFooter,
  LinkedInPostCardFooterActions,
} from './linkedin-post-card-footer'
import LinkedInPostCardHeader from './linkedin-post-card-header'
import LinkedInPostCardSkeleton from './linkedin-post-card-skeleton'
import PostCardActions from './post-card-actions'

export interface LinkedInPostCardProps {
  // Content
  initialContent?: string
  onContentChange?: (content: string) => void

  // Loading states
  loading: boolean
  isActionLoading?: boolean
}

function LinkedInPostCard(props: LinkedInPostCardProps) {
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
    return <LinkedInPostCardSkeleton />
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
        <div className="absolute top-2 right-2 z-2 lg:top-0 lg:-right-9">
          <PostCardActions onEmojiSelect={addEmoji} />
        </div>
      )}

      {/* Post Card */}
      <div
        className={cn(
          'bg-card relative rounded-lg border-1',
          props.isActionLoading && 'opacity-50'
        )}
      >
        {/* Header */}
        <LinkedInPostCardHeader user={user_social} />

        {/* Text area */}
        <div className="px-4 pt-1 pb-2">
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
        <LinkedInPostCardFooter />
      </div>

      {/* Footer Actions */}
      <LinkedInPostCardFooterActions content={content} />
    </div>
  )
}

export default LinkedInPostCard

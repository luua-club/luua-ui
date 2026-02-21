import { useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { POST_WORD_COUNT } from '@/core/config/constant'
import { UPLOAD_CONFIGS } from '@/core/config/upload.config'
import { usePostCardComposer } from '@/core/hooks/post-card-composer.hook'
import { useUserState } from '@/core/hooks/user-state.hook'
import { MediaObject } from '@/core/models/post.model'
import { extractUserInitial } from '@/core/utils/common.util'
import UpgradePlanCta from '@/shared/components/upgrade-plan-cta'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Textarea } from '@/shared/ui/textarea'
import { cn } from '@/shared/utils'

import PostImagePreview from '../post-preview/PostImagePreview'
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
  initialImages?: MediaObject[]
  onContentChange: (content: string) => void
  onImagesChange: (images: MediaObject[]) => void
  // Loading states
  loading: boolean
  isActionLoading?: boolean
}

function TwitterPostCard(props: TwitterPostCardProps) {
  // --- Hooks ---
  const user = useUserState()
  const { content, setContent, textareaRef, updateSelectionRef, addEmoji } =
    usePostCardComposer()
  const router = useRouter()

  // --- State ---
  const [imagePreviews, setImagePreviews] = useState<MediaObject[]>([])

  // --- Effects ---
  /**
   * Syncs content with initialContent prop (including clearing when undefined)
   */
  useEffect(() => {
    setContent(props.initialContent ?? '')
  }, [props.initialContent, setContent])

  /**
   * Syncs images with initialImages prop (including clearing when undefined/empty)
   */
  useEffect(() => {
    setImagePreviews(props.initialImages ?? [])
  }, [props.initialImages])

  // --- Handlers ---
  const handleFilesUploaded = (fileUrls: string[]) => {
    const newImages = [...imagePreviews, ...fileUrls.map(url => ({ url }))]
    setImagePreviews(newImages)
    props.onImagesChange(newImages)
  }

  const removeImageAt = (index: number) => {
    const newImages = imagePreviews.filter((_, i) => i !== index)
    setImagePreviews(newImages)
    props.onImagesChange(newImages)
  }

  // --- Early Returns ---
  if (!user || props.loading) {
    return <TwitterPostCardSkeleton />
  }

  // --- Computed Variables ---
  const user_social = { ...user.connected_channels.twitter }
  user_social.user_name = user_social.user_name || user.name
  user_social.user_id = user_social.user_id || user.email
  user_social.user_profile_picture =
    user_social.user_profile_picture || user.profile_image
  const overlayClassNames =
    'bg-background/20 dark:bg-background/80 absolute top-0 left-0 z-10 flex h-full w-full flex-col items-center justify-center gap-4 rounded-lg border backdrop-blur-[5px]'
  const isProPlan = user.plan === 'Pro'

  // Calculate remaining upload slots
  const maxAllowedFiles = UPLOAD_CONFIGS.Twitter.maxFiles
  const remainingSlots = Math.max(0, maxAllowedFiles - imagePreviews.length)

  return (
    <div className="relative">
      {!isProPlan && (
        <div className={overlayClassNames}>
          <p className="font-semibold">
            Upgrade plan to post content for Twitter/X
          </p>
          <UpgradePlanCta
            onClick={() =>
              router.navigate({
                to: '/payments',
              })
            }
          />
        </div>
      )}

      {/* Actions */}
      {!props.isActionLoading && (
        <div className="absolute top-2 right-2 z-2 lg:top-0 lg:-right-9">
          <PostCardActions
            onEmojiSelect={addEmoji}
            onFilesUploaded={handleFilesUploaded}
            uploadConfig={{
              ...UPLOAD_CONFIGS.Twitter,
              maxFiles: remainingSlots,
            }}
          />
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
            src={user_social.user_profile_picture ?? undefined}
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
                'caret-primary selection:bg-brand-accent-yellow selection:text-black',
                'transition-colors duration-200',
                'focus:border-1 focus:shadow-none focus:ring-0 focus:outline-none',
                'focus-visible:border-1 focus-visible:border-dashed focus-visible:shadow-none focus-visible:ring-0'
              )}
              placeholder="Your post starts here — Type or ask AI to help..."
              ref={textareaRef}
              autoFocus
              value={content}
              maxLength={POST_WORD_COUNT.Twitter}
              onChange={e => {
                const val = e.target.value
                setContent(val)
                props.onContentChange(val)
              }}
              onSelect={updateSelectionRef}
              onKeyUp={updateSelectionRef}
              onClick={updateSelectionRef}
              disabled={props.isActionLoading}
            />
          </div>

          {/* Image Preview */}
          {imagePreviews.length > 0 && (
            <div className="my-2 overflow-hidden rounded-2xl">
              <PostImagePreview
                imagePreviews={imagePreviews.map(img => img.url)}
                onRemove={props.isActionLoading ? undefined : removeImageAt}
              />
            </div>
          )}

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

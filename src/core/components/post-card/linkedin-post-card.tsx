import { useEffect, useState } from 'react'

import { POST_WORD_COUNT } from '@/core/config/constant'
import { UPLOAD_CONFIGS } from '@/core/config/upload.config'
import { MediaObject } from '@/core/models/post.model'
import { ProjectSocial } from '@/core/models/social.model'
import { Textarea } from '@/shared/ui/textarea'
import { cn } from '@/shared/utils'

import { usePostCardComposer } from '../../hooks/post-card-composer.hook'
import { useProjectDetail } from '../../hooks/project-detail.hook'
import { useUserState } from '../../hooks/user-state.hook'
import PostImagePreview from '../post-preview/PostImagePreview'
import {
  LinkedInPostCardFooter,
  LinkedInPostCardFooterActions,
} from './linkedin-post-card-footer'
import LinkedInPostCardHeader from './linkedin-post-card-header'
import LinkedInPostCardSkeleton from './linkedin-post-card-skeleton'
import PostCardActions from './post-card-actions'
import { PostFormatToolbar } from './post-format-toolbar'

export interface LinkedInPostCardProps {
  // Content
  initialContent?: string
  initialImages?: MediaObject[]
  onContentChange: (content: string) => void
  onImagesChange: (images: MediaObject[]) => void

  // Loading states
  loading: boolean
  isActionLoading?: boolean
}

function LinkedInPostCard(props: LinkedInPostCardProps) {
  // --- Hooks ---
  const user = useUserState()
  const { connectedChannels } = useProjectDetail()
  const { content, setContent, textareaRef, updateSelectionRef, addEmoji } =
    usePostCardComposer()

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
    return <LinkedInPostCardSkeleton />
  }

  // --- Computed Variables ---
  const linkedin = connectedChannels?.linkedin
  const channelProfile: ProjectSocial = {
    connected: linkedin?.connected ?? false,
    default: linkedin?.default ?? false,
    user_name: linkedin?.user_name || user.name,
    user_id: linkedin?.user_email || user.email,
    user_email: linkedin?.user_email ?? '',
    user_profile_picture: linkedin?.user_profile_picture || user.profile_image,
    meta: linkedin?.meta ?? {
      pages: [],
      account_type: null,
      organization_id: null,
      organizaion_name: null,
      organization_name: null,
      organization_profile_image: null,
    },
  }

  // Calculate remaining upload slots
  const maxAllowedFiles = UPLOAD_CONFIGS.LinkedIn.maxFiles
  const remainingSlots = Math.max(0, maxAllowedFiles - imagePreviews.length)

  return (
    <div className="relative">
      {/* Actions */}
      {/* {!props.isActionLoading && (
        <div className="absolute top-2 right-2 z-2 lg:top-0 lg:-right-9">
          <PostCardActions
            onEmojiSelect={addEmoji}
            onFilesUploaded={handleFilesUploaded}
            uploadConfig={{
              ...UPLOAD_CONFIGS.LinkedIn,
              maxFiles: remainingSlots,
            }}
          />
        </div>
      )} */}

      <PostFormatToolbar
        textareaRef={textareaRef}
        content={content}
        setContent={val => {
          setContent(val)
          props.onContentChange(val)
        }}
        onContentChange={props.onContentChange}
      />

      {/* Post Card */}
      <div
        className={cn(
          'bg-card relative rounded-lg border-1',
          props.isActionLoading && 'opacity-50'
        )}
      >
        {/* Header */}
        <LinkedInPostCardHeader channel={channelProfile} />

        {/* Text area */}
        <div className="px-4 pt-1 pb-2">
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
            maxLength={POST_WORD_COUNT.LinkedIn}
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
          <div className="mt-2">
            <PostImagePreview
              imagePreviews={imagePreviews.map(img => img.url)}
              onRemove={props.isActionLoading ? undefined : removeImageAt}
            />
          </div>
        )}

        {/* Cosmetic Footer */}
        <LinkedInPostCardFooter />
      </div>

      {/* Footer Actions */}
      <LinkedInPostCardFooterActions content={content} />
    </div>
  )
}

export default LinkedInPostCard

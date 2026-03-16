import { AnimatePresence } from 'motion/react'
import { type RefObject, useEffect, useState } from 'react'

import BrandLinkedIn from '@/assets/icons/offcial-linkedin.svg?react'
import { POST_WORD_COUNT } from '@/core/config/constant'
import { UPLOAD_CONFIGS } from '@/core/config/upload.config'
import { MediaObject } from '@/core/models/post.model'
import { ProjectSocial } from '@/core/models/social.model'
import { hasStylizedUnicodeFormatting } from '@/core/utils/text-format.util'
import ImageGenerationModal from '@/creation/components/image-generation-modal'
import GenerateImagePostHolder from '@/shared/components/generate-image-post-holder'
import { GeneratedGlow } from '@/shared/ui/generated-glow'
import { Textarea } from '@/shared/ui/textarea'
import { cn } from '@/shared/utils'

import {
  type UsePostCardComposer,
  usePostCardComposer,
} from '../../hooks/post-card-composer.hook'
import { useUserState } from '../../hooks/user-state.hook'
import PostImagePreview from '../post-preview/PostImagePreview'
import {
  LinkedInPostCardFooter,
  LinkedInPostCardFooterActions,
} from './linkedin-post-card-footer'
import LinkedInPostCardHeader from './linkedin-post-card-header'
import LinkedInPostCardSkeleton from './linkedin-post-card-skeleton'
import { PostCardMode } from './post-card.types'
import { type UploadConfig } from './post-card-actions'
import { PostPlatformLabel } from './post-platform-label'
import { PostTextarea } from './post-textarea'

interface CommonCardProps {
  content: string
  imagePreviews: MediaObject[]
  channelProfile: ProjectSocial
  textareaRef: RefObject<HTMLTextAreaElement | null>
  isActionLoading?: boolean
  setContent?: (value: string) => void
  onContentChange?: (value: string) => void
  onRemoveImage?: (index: number) => void
  onSelectionUpdate?: UsePostCardComposer['updateSelectionRef']
  hasUnicodeFormatting?: boolean
  onRequestEdit?: () => void
  shimmer?: boolean
  onFilesUploaded?: (urls: string[]) => void
  uploadConfig?: UploadConfig
}

export interface LinkedInPostCardProps {
  initialContent?: string
  initialImages?: MediaObject[]
  onContentChange: (content: string) => void
  onImagesChange: (images: MediaObject[]) => void
  loading: boolean
  isActionLoading?: boolean
  shimmer?: boolean
  mode?: PostCardMode
  showPreviewDetails?: boolean
  onRequestEdit?: () => void
}

function LinkedInEditorCard({
  content,
  imagePreviews,
  channelProfile,
  textareaRef,
  isActionLoading,
  setContent,
  onContentChange,
  onRemoveImage,
  onSelectionUpdate,
  hasUnicodeFormatting,
  shimmer,
  onFilesUploaded,
  uploadConfig,
}: CommonCardProps) {
  const [imageGenOpen, setImageGenOpen] = useState(false)

  return (
    <>
      <GeneratedGlow active={shimmer ?? false} className="rounded-md">
        <div className="bg-card/95 dark:bg-card relative rounded-md border py-2">
          <div className="absolute top-4 right-4 flex items-center gap-1.5">
            <BrandLinkedIn className="size-3" />
            <span className="text-xs font-medium">LinkedIn</span>
          </div>

          <LinkedInPostCardHeader channel={channelProfile} />

          <div className="px-4 pt-1 pb-2">
            <PostTextarea
              textareaRef={textareaRef}
              content={content}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              setContent={setContent ?? (() => {})}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onContentChange={onContentChange ?? (() => {})}
              onFilesUploaded={onFilesUploaded}
              uploadConfig={uploadConfig}
              placeholder="Your post starts here — Type or ask AI to help..."
              maxLength={POST_WORD_COUNT.LinkedIn}
              disabled={isActionLoading}
              onSelectionUpdate={onSelectionUpdate}
              textareaClassName={cn('min-h-52 md:min-h-28')}
            />
          </div>

          <AnimatePresence>
            {!!content && (
              <div className="mx-4">
                <GenerateImagePostHolder
                  handleOnClick={() => setImageGenOpen(true)}
                />
              </div>
            )}
          </AnimatePresence>

          {imagePreviews.length > 0 && (
            <div className="mt-2">
              <PostImagePreview
                imagePreviews={imagePreviews.map(img => img.url)}
                onRemove={isActionLoading ? undefined : onRemoveImage}
              />
            </div>
          )}
        </div>
      </GeneratedGlow>

      <LinkedInPostCardFooterActions
        content={content}
        showUnicodeHint={hasUnicodeFormatting}
      />

      <ImageGenerationModal
        open={imageGenOpen}
        onOpenChange={setImageGenOpen}
        onImageGenerated={url => onFilesUploaded?.([url])}
        postContent={content}
      />
    </>
  )
}

function LinkedInPreviewCard({
  content,
  imagePreviews,
  channelProfile,
  textareaRef,
  onRequestEdit,
  shimmer,
}: CommonCardProps) {
  return (
    <>
      <PostPlatformLabel
        icon={<BrandLinkedIn className="size-3" />}
        label="LinkedIn"
      />

      <GeneratedGlow active={shimmer ?? false} className="rounded-md">
        <div className="bg-card/95 dark:bg-card relative rounded-md border">
          <LinkedInPostCardHeader channel={channelProfile} />

          <Textarea
            className="resize-none border-0 border-transparent !bg-transparent pt-0 text-sm shadow-none ring-0 transition-colors duration-200 outline-none focus:bg-transparent focus:ring-0 focus-visible:border-0 focus-visible:ring-0 dark:!bg-transparent dark:focus:bg-transparent"
            placeholder="Your written content will appear here"
            ref={textareaRef}
            value={content}
            maxLength={POST_WORD_COUNT.LinkedIn}
            readOnly
            tabIndex={-1}
            onMouseDown={e => {
              e.preventDefault()
              onRequestEdit?.()
            }}
          />

          {imagePreviews.length > 0 && (
            <div className="mt-2">
              <PostImagePreview
                imagePreviews={imagePreviews.map(img => img.url)}
              />
            </div>
          )}

          <LinkedInPostCardFooter />
        </div>
      </GeneratedGlow>
    </>
  )
}

function LinkedInPostCard(props: LinkedInPostCardProps) {
  const user = useUserState()
  const connectedChannels = user?.connectedChannels
  const { content, setContent, textareaRef, updateSelectionRef } =
    usePostCardComposer()

  const [imagePreviews, setImagePreviews] = useState<MediaObject[]>([])

  useEffect(() => {
    setContent(props.initialContent ?? '')
  }, [props.initialContent, setContent])

  useEffect(() => {
    setImagePreviews(props.initialImages ?? [])
  }, [props.initialImages])

  if (!user || props.loading) {
    return <LinkedInPostCardSkeleton />
  }

  const mode: PostCardMode = props.mode
    ? props.mode
    : props.showPreviewDetails
      ? 'preview'
      : 'editor'

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

  const remainingSlots = Math.max(
    0,
    UPLOAD_CONFIGS.LinkedIn.maxFiles - imagePreviews.length
  )

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

  const isEditorMode = mode === 'editor'
  const hasUnicodeFormatting = hasStylizedUnicodeFormatting(content)

  return (
    <div className="relative">
      {isEditorMode && (
        <LinkedInEditorCard
          content={content}
          imagePreviews={imagePreviews}
          channelProfile={channelProfile}
          textareaRef={textareaRef}
          isActionLoading={props.isActionLoading}
          setContent={setContent}
          onContentChange={props.onContentChange}
          onRemoveImage={removeImageAt}
          onSelectionUpdate={updateSelectionRef}
          hasUnicodeFormatting={hasUnicodeFormatting}
          shimmer={props.shimmer}
          onFilesUploaded={handleFilesUploaded}
          uploadConfig={{
            ...UPLOAD_CONFIGS.LinkedIn,
            maxFiles: remainingSlots,
          }}
        />
      )}

      {!isEditorMode && (
        <LinkedInPreviewCard
          content={content}
          imagePreviews={imagePreviews}
          channelProfile={channelProfile}
          textareaRef={textareaRef}
          onRequestEdit={props.onRequestEdit}
          shimmer={props.shimmer}
        />
      )}
    </div>
  )
}

export default LinkedInPostCard

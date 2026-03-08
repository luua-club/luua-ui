import { AnimatePresence } from 'motion/react'
import { type RefObject, useEffect, useState } from 'react'

import BrandBluesky from '@/assets/icons/brand-bluesky.svg?react'
import { POST_WORD_COUNT } from '@/core/config/constant'
import { UPLOAD_CONFIGS } from '@/core/config/upload.config'
import {
  type UsePostCardComposer,
  usePostCardComposer,
} from '@/core/hooks/post-card-composer.hook'
import { useUserState } from '@/core/hooks/user-state.hook'
import { MediaObject } from '@/core/models/post.model'
import { ProjectSocial } from '@/core/models/social.model'
import ImageGenerationModal from '@/creation/components/image-generation-modal'
import GenerateImagePostHolder from '@/shared/components/generate-image-post-holder'
import { AnimatedCircularProgressBar } from '@/shared/ui/animated-circular-progress-bar'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { GeneratedGlow } from '@/shared/ui/generated-glow'
import { Textarea } from '@/shared/ui/textarea'
import { cn } from '@/shared/utils'

import { extractUserInitial } from '../../utils/common.util'
import PostImagePreview from '../post-preview/PostImagePreview'
import { PostCardMode } from './post-card.types'
import { PostFormatToolbar } from './post-format-toolbar'
import { PostPlatformLabel } from './post-platform-label'
import TwitterPostCardHeader from './twitter-post-card-header'
import TwitterPostCardSkeleton from './twitter-post-card-skeleton'

interface CommonCardProps {
  content: string
  imagePreviews: MediaObject[]
  channelProfile: ProjectSocial
  textareaRef: RefObject<HTMLTextAreaElement | null>
  isActionLoading?: boolean
  onContentChange?: (value: string) => void
  onRemoveImage?: (index: number) => void
  onSelectionUpdate?: UsePostCardComposer['updateSelectionRef']
  hasUnicodeFormatting?: boolean
  onRequestEdit?: () => void
  shimmer?: boolean
  onFilesUploaded?: (urls: string[]) => void
}

export interface BlueskyPostCardProps {
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

function BlueskyFooterActions({ content }: { content: string }) {
  const maxChars = POST_WORD_COUNT.Bluesky
  const usedChars = content.length
  const textColor =
    usedChars >= maxChars
      ? 'text-red-600 dark:text-red-400'
      : usedChars >= maxChars * 0.5
        ? 'text-yellow-500 dark:text-yellow-400'
        : ''
  const percentage = Math.round((usedChars / maxChars) * 100)
  const primaryColorLight =
    usedChars >= maxChars
      ? '#dc2626'
      : usedChars >= maxChars * 0.5
        ? '#eab308'
        : '#22c55e'
  const primaryColorDark =
    usedChars >= maxChars
      ? '#f87171'
      : usedChars >= maxChars * 0.5
        ? '#fbbf24'
        : '#4ade80'

  return (
    <div className="mt-2 flex items-center justify-end gap-2">
      <AnimatedCircularProgressBar
        max={100}
        min={0}
        value={percentage}
        gaugePrimaryColor={primaryColorLight}
        gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
        className="size-4 dark:hidden [&>span]:hidden"
      />
      <AnimatedCircularProgressBar
        max={100}
        min={0}
        value={percentage}
        gaugePrimaryColor={primaryColorDark}
        gaugeSecondaryColor="rgba(255, 255, 255, 0.15)"
        className="hidden size-4 dark:block [&>span]:hidden"
      />
      <p className={cn('text-xs', textColor)}>
        {usedChars}/{maxChars}
      </p>
    </div>
  )
}

function BlueskyEditorCard({
  content,
  imagePreviews,
  channelProfile,
  textareaRef,
  isActionLoading,
  onContentChange,
  onRemoveImage,
  onSelectionUpdate,
  shimmer,
  onFilesUploaded,
}: CommonCardProps) {
  const [imageGenOpen, setImageGenOpen] = useState(false)

  return (
    <>
      <GeneratedGlow active={shimmer ?? false} className="rounded-md">
        <div
          className={cn(
            'bg-card/95 dark:bg-card relative flex h-fit gap-2 rounded-md border p-3'
          )}
        >
          <div className="bg-card absolute top-3 right-4 flex items-center gap-1.5 rounded-md px-2 py-1">
            <BrandBluesky className="size-3" />
            <span className="text-xs font-medium">Bluesky</span>
          </div>

          <Avatar className="!h-10 !w-10 md:!h-12 md:!w-12">
            <AvatarImage
              src={channelProfile.user_profile_picture ?? undefined}
              alt={channelProfile.user_name}
            />
            <AvatarFallback>
              {extractUserInitial(channelProfile.user_name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-1 flex-col">
            <TwitterPostCardHeader channel={channelProfile} />

            <div className="pt-1 pb-2">
              <Textarea
                className={cn(
                  'min-h-52 resize-none text-sm md:min-h-28',
                  'caret-primary selection:bg-brand-accent-yellow border-1 border-dashed selection:text-black',
                  'transition-colors duration-200',
                  'focus:border-1 focus:shadow-none focus:ring-0 focus:outline-none',
                  'focus-visible:border-1 focus-visible:border-dashed focus-visible:shadow-none focus-visible:ring-0'
                )}
                placeholder="Your post starts here — Type or ask AI to help..."
                ref={textareaRef}
                value={content}
                maxLength={POST_WORD_COUNT.Bluesky}
                onChange={e => onContentChange?.(e.target.value)}
                onSelect={onSelectionUpdate}
                onKeyUp={onSelectionUpdate}
                onClick={onSelectionUpdate}
                disabled={isActionLoading}
              />
            </div>

            <AnimatePresence>
              {!!content && (
                <GenerateImagePostHolder
                  handleOnClick={() => setImageGenOpen(true)}
                />
              )}
            </AnimatePresence>

            {imagePreviews.length > 0 && (
              <div className="my-2 overflow-hidden rounded-2xl">
                <PostImagePreview
                  imagePreviews={imagePreviews.map(img => img.url)}
                  onRemove={isActionLoading ? undefined : onRemoveImage}
                />
              </div>
            )}
          </div>
        </div>
      </GeneratedGlow>

      <BlueskyFooterActions content={content} />

      <ImageGenerationModal
        open={imageGenOpen}
        onOpenChange={setImageGenOpen}
        onImageGenerated={url => onFilesUploaded?.([url])}
        postContent={content}
      />
    </>
  )
}

function BlueskyPreviewCard({
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
        icon={<BrandBluesky className="size-3" />}
        label="Bluesky"
      />

      <GeneratedGlow active={shimmer ?? false} className="rounded-md">
        <div className="bg-card/95 dark:bg-card relative flex h-fit gap-2 rounded-md border p-3">
          <Avatar className="!h-10 !w-10 md:!h-12 md:!w-12">
            <AvatarImage
              src={channelProfile.user_profile_picture ?? undefined}
              alt={channelProfile.user_name}
            />
            <AvatarFallback>
              {extractUserInitial(channelProfile.user_name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-1 flex-col">
            <TwitterPostCardHeader channel={channelProfile} />

            <Textarea
              className="resize-none border-0 border-transparent !bg-transparent p-0 pt-1 text-sm shadow-none ring-0 transition-colors duration-200 outline-none focus:bg-transparent focus:ring-0 focus-visible:border-0 focus-visible:ring-0 dark:!bg-transparent dark:focus:bg-transparent"
              placeholder="Your written content will appear here"
              ref={textareaRef}
              value={content}
              maxLength={POST_WORD_COUNT.Bluesky}
              readOnly
              tabIndex={-1}
              onMouseDown={e => {
                e.preventDefault()
                onRequestEdit?.()
              }}
            />

            {imagePreviews.length > 0 && (
              <div className="my-2 overflow-hidden rounded-2xl">
                <PostImagePreview
                  imagePreviews={imagePreviews.map(img => img.url)}
                />
              </div>
            )}
          </div>
        </div>
      </GeneratedGlow>
    </>
  )
}

function BlueskyPostCard(props: BlueskyPostCardProps) {
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
    return <TwitterPostCardSkeleton />
  }

  const mode: PostCardMode = props.mode
    ? props.mode
    : props.showPreviewDetails
      ? 'preview'
      : 'editor'

  const blueskyChannel = connectedChannels?.bluesky
  const channelProfile: ProjectSocial = {
    connected: blueskyChannel?.connected ?? false,
    default: blueskyChannel?.default ?? false,
    user_name: blueskyChannel?.user_name || user.name,
    user_id: blueskyChannel?.user_id || user.email,
    user_email: blueskyChannel?.user_email ?? '',
    user_profile_picture:
      blueskyChannel?.user_profile_picture || user.profile_image,
    meta: blueskyChannel?.meta ?? {
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
    UPLOAD_CONFIGS.Bluesky.maxFiles - imagePreviews.length
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

  return (
    <div className="relative">
      {isEditorMode && (
        <PostFormatToolbar
          textareaRef={textareaRef}
          content={content}
          setContent={val => {
            setContent(val)
            props.onContentChange(val)
          }}
          onContentChange={props.onContentChange}
          onFilesUploaded={handleFilesUploaded}
          uploadConfig={{ ...UPLOAD_CONFIGS.Bluesky, maxFiles: remainingSlots }}
        />
      )}

      {isEditorMode ? (
        <BlueskyEditorCard
          content={content}
          imagePreviews={imagePreviews}
          channelProfile={channelProfile}
          textareaRef={textareaRef}
          isActionLoading={props.isActionLoading}
          onContentChange={val => {
            setContent(val)
            props.onContentChange(val)
          }}
          onRemoveImage={removeImageAt}
          onSelectionUpdate={updateSelectionRef}
          shimmer={props.shimmer}
          onFilesUploaded={handleFilesUploaded}
        />
      ) : (
        <BlueskyPreviewCard
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

export default BlueskyPostCard

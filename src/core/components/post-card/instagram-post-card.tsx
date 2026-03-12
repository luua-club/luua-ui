import {
  Bookmark,
  Heart,
  ImagePlus,
  List,
  ListOrdered,
  MessageCircle,
  MoreHorizontal,
  Send,
} from 'lucide-react'
import { type RefObject, useEffect, useRef, useState } from 'react'

import BrandInstagram from '@/assets/icons/brand-instagram.svg?react'
import { POST_WORD_COUNT } from '@/core/config/constant'
import { UPLOAD_CONFIGS } from '@/core/config/upload.config'
import {
  type UsePostCardComposer,
  usePostCardComposer,
} from '@/core/hooks/post-card-composer.hook'
import { useUserState } from '@/core/hooks/user-state.hook'
import { MediaObject } from '@/core/models/post.model'
import { ProjectSocial } from '@/core/models/social.model'
import {
  applyBold,
  applyBullet,
  applyItalic,
  applyNumbered,
  applyStrikethrough,
} from '@/core/utils/text-format.util'
import { AnimatedCircularProgressBar } from '@/shared/ui/animated-circular-progress-bar'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { GeneratedGlow } from '@/shared/ui/generated-glow'
import { Separator } from '@/shared/ui/separator'
import { Textarea } from '@/shared/ui/textarea'
import { cn } from '@/shared/utils'

import { extractUserInitial } from '../../utils/common.util'
import PostImagePreview from '../post-preview/PostImagePreview'
import { PostCardMode } from './post-card.types'
import PostCardActions, {
  type PostCardActionsHandle,
  type UploadConfig,
} from './post-card-actions'
import { PostPlatformLabel } from './post-platform-label'
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
  uploadConfig?: UploadConfig
}

export interface InstagramPostCardProps {
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

function InstagramFooterActions({ content }: { content: string }) {
  const maxChars = POST_WORD_COUNT.Instagram
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

function InstagramGradientAvatar({
  src,
  alt,
  fallback,
}: {
  src?: string
  alt: string
  fallback: string
}) {
  return (
    <div
      className="flex-shrink-0 rounded-full p-[2px]"
      style={{
        background:
          'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
      }}
    >
      <div className="bg-card rounded-full p-[2px]">
        <Avatar className="size-8">
          <AvatarImage src={src} alt={alt} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}

function InstagramActionBar() {
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <div className="flex items-center gap-4">
        <Heart className="text-muted-foreground size-5" />
        <MessageCircle className="text-muted-foreground size-5" />
        <Send className="text-muted-foreground size-5" />
      </div>
      <Bookmark className="text-muted-foreground size-5" />
    </div>
  )
}

function InlineFormatBar({
  textareaRef,
  content,
  setContent,
  onFilesUploaded,
  uploadActionsRef,
  uploadConfig,
  className,
}: {
  textareaRef: RefObject<HTMLTextAreaElement | null>
  content: string
  setContent: (val: string) => void
  onFilesUploaded?: (urls: string[]) => void
  uploadActionsRef: RefObject<PostCardActionsHandle | null>
  uploadConfig?: UploadConfig
  className?: string
}) {
  function applyFormat(transform: (text: string) => string) {
    const el = textareaRef.current
    const start = el?.selectionStart ?? 0
    const end = el?.selectionEnd ?? 0
    const hasSelection = start !== end

    let next: string
    let newStart: number
    let newEnd: number

    if (hasSelection) {
      const selected = content.slice(start, end)
      const transformed = transform(selected)
      next = content.slice(0, start) + transformed + content.slice(end)
      newStart = start
      newEnd = start + transformed.length
    } else {
      next = transform(content)
      newStart = 0
      newEnd = next.length
    }

    setContent(next)

    requestAnimationFrame(() => {
      if (!el) return
      el.focus()
      try {
        el.selectionStart = hasSelection ? newStart : newEnd
        el.selectionEnd = hasSelection ? newEnd : newEnd
      } catch {}
    })
  }

  function insertEmoji(emoji: string) {
    const el = textareaRef.current
    const start = el?.selectionStart ?? content.length
    const end = el?.selectionEnd ?? content.length
    const next = content.slice(0, start) + emoji + content.slice(end)
    setContent(next)
    requestAnimationFrame(() => {
      if (!el) return
      el.focus()
      try {
        el.selectionStart = start + emoji.length
        el.selectionEnd = start + emoji.length
      } catch {}
    })
  }

  return (
    <div className={cn('mt-1.5 flex items-center gap-0.5', className)}>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-sm font-bold"
        onClick={() => applyFormat(applyBold)}
        title="Bold"
        type="button"
      >
        B
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-sm italic"
        onClick={() => applyFormat(applyItalic)}
        title="Italic"
        type="button"
      >
        I
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-sm line-through"
        onClick={() => applyFormat(applyStrikethrough)}
        title="Strikethrough"
        type="button"
      >
        S
      </Button>
      <Separator orientation="vertical" className="mx-0.5 !h-5" />
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => applyFormat(applyBullet)}
        title="Bullet list"
        type="button"
      >
        <List className="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => applyFormat(applyNumbered)}
        title="Numbered list"
        type="button"
      >
        <ListOrdered className="size-3.5" />
      </Button>
      <div className="ml-auto">
        <PostCardActions
          ref={uploadActionsRef}
          onEmojiSelect={insertEmoji}
          onFilesUploaded={onFilesUploaded}
          uploadConfig={uploadConfig}
        />
      </div>
    </div>
  )
}

function InstagramEditorCard({
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
  uploadConfig,
}: CommonCardProps) {
  const uploadActionsRef = useRef<PostCardActionsHandle>(null)

  return (
    <div className="max-w-[470px]">
      {/* === THE CARD === */}
      <GeneratedGlow active={shimmer ?? false} className="rounded-md">
        <div className="bg-card/95 dark:bg-card relative overflow-hidden rounded-md border">
          {/* Header row */}
          <div className="flex items-center justify-between px-3 pt-3 pb-2">
            <div className="flex min-w-0 items-center gap-3">
              <InstagramGradientAvatar
                src={channelProfile.user_profile_picture ?? undefined}
                alt={channelProfile.user_name}
                fallback={extractUserInitial(channelProfile.user_name)}
              />
              <span className="min-w-0 truncate text-sm font-semibold">
                {channelProfile.user_name}
              </span>
            </div>
            <div className="bg-card flex flex-shrink-0 items-center gap-1.5 rounded-md px-2 py-1">
              <BrandInstagram className="size-3" />
              <span className="text-xs font-medium">Instagram</span>
            </div>
          </div>

          {/* Image Area */}
          {imagePreviews.length > 0 ? (
            <div className="overflow-hidden">
              <PostImagePreview
                imagePreviews={imagePreviews.map(img => img.url)}
                onRemove={isActionLoading ? undefined : onRemoveImage}
              />
            </div>
          ) : (
            <button
              type="button"
              className="group bg-muted/40 hover:bg-muted/60 relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-none border-y border-dashed transition-colors disabled:opacity-70"
              onClick={() => uploadActionsRef.current?.openUploadDialog()}
              disabled={isActionLoading}
            >
              {/* CTA stack */}
              <div className="relative z-10 flex flex-col items-center gap-3 text-center">
                <div className="bg-muted/70 border-muted-foreground/20 flex size-12 items-center justify-center rounded-full border">
                  <ImagePlus className="text-muted-foreground size-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Upload photos</p>
                  <p className="text-muted-foreground text-xs">
                    JPG, PNG • up to 10 images
                  </p>
                </div>
                <span className="bg-card/80 text-foreground/80 border-muted-foreground/20 rounded-full border px-3 py-1 text-xs font-medium">
                  Choose files
                </span>
              </div>
            </button>
          )}

          {/* Comment area (inside card) */}
          <div className="border-border/60 border-t px-3 pb-3">
            <InlineFormatBar
              textareaRef={textareaRef}
              content={content}
              setContent={val => onContentChange?.(val)}
              onFilesUploaded={onFilesUploaded}
              uploadActionsRef={uploadActionsRef}
              uploadConfig={uploadConfig}
              className="mb-2"
            />
            <Textarea
              className={cn(
                'min-h-20 resize-none text-sm',
                'caret-primary selection:bg-brand-accent-yellow border-1 border-dashed selection:text-black',
                'transition-colors duration-200',
                'focus:border-1 focus:shadow-none focus:ring-0 focus:outline-none',
                'focus-visible:border-1 focus-visible:border-dashed focus-visible:shadow-none focus-visible:ring-0'
              )}
              placeholder="Write your caption..."
              ref={textareaRef}
              value={content}
              maxLength={POST_WORD_COUNT.Instagram}
              onChange={e => onContentChange?.(e.target.value)}
              onSelect={onSelectionUpdate}
              onKeyUp={onSelectionUpdate}
              onClick={onSelectionUpdate}
              disabled={isActionLoading}
            />
          </div>
        </div>
      </GeneratedGlow>

      {/* === CAPTION AREA (outside the card) === */}
      <div className="mt-3">
        <InstagramFooterActions content={content} />
      </div>
    </div>
  )
}

function InstagramPreviewCard({
  content,
  imagePreviews,
  channelProfile,
  textareaRef,
  onRequestEdit,
  shimmer,
}: CommonCardProps) {
  return (
    <div className="max-w-[470px]">
      <PostPlatformLabel
        icon={<BrandInstagram className="size-3" />}
        label="Instagram"
      />

      <GeneratedGlow active={shimmer ?? false} className="rounded-md">
        <div className="bg-card/95 dark:bg-card relative overflow-hidden rounded-md border">
          {/* Header row */}
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 pt-3 pb-2">
            <InstagramGradientAvatar
              src={channelProfile.user_profile_picture ?? undefined}
              alt={channelProfile.user_name}
              fallback={extractUserInitial(channelProfile.user_name)}
            />
            <div className="min-w-0">
              <div className="text-sm font-semibold">
                <span className="truncate align-middle">
                  {channelProfile.user_name}
                </span>
                <span className="text-muted-foreground ml-2 align-middle text-xs">
                  15h
                </span>
              </div>
              <p className="text-muted-foreground mt-0.5 text-xs leading-tight">
                Midnight City — M83
              </p>
            </div>
            <MoreHorizontal className="text-muted-foreground size-5" />
          </div>

          {/* Image display */}
          {imagePreviews.length > 0 && (
            <div className="overflow-hidden">
              <PostImagePreview
                imagePreviews={imagePreviews.map(img => img.url)}
              />
            </div>
          )}

          {/* Action bar */}
          <InstagramActionBar />

          {/* Caption area */}
          {content ? (
            <div className="px-3 pb-2">
              <p className="mb-0.5 text-sm font-semibold">
                {channelProfile.user_name}
              </p>
              <Textarea
                className="min-h-0 resize-none border-0 border-transparent !bg-transparent p-0 text-sm leading-5 shadow-none ring-0 transition-colors duration-200 outline-none focus:bg-transparent focus:ring-0 focus-visible:border-0 focus-visible:ring-0 dark:!bg-transparent dark:focus:bg-transparent"
                ref={textareaRef}
                value={content}
                maxLength={POST_WORD_COUNT.Instagram}
                readOnly
                tabIndex={-1}
                onMouseDown={e => {
                  e.preventDefault()
                  onRequestEdit?.()
                }}
              />
            </div>
          ) : null}
        </div>
      </GeneratedGlow>
    </div>
  )
}

function InstagramPostCard(props: InstagramPostCardProps) {
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

  const instagramChannel = connectedChannels?.instagram
  const channelProfile: ProjectSocial = {
    connected: instagramChannel?.connected ?? false,
    default: instagramChannel?.default ?? false,
    user_name: instagramChannel?.user_name || user.name,
    user_id: instagramChannel?.user_id || user.email,
    user_email: instagramChannel?.user_email ?? '',
    user_profile_picture:
      instagramChannel?.user_profile_picture || user.profile_image,
    meta: instagramChannel?.meta ?? {
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
    UPLOAD_CONFIGS.Instagram.maxFiles - imagePreviews.length
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
      {isEditorMode ? (
        <InstagramEditorCard
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
          uploadConfig={{
            ...UPLOAD_CONFIGS.Instagram,
            maxFiles: remainingSlots,
          }}
        />
      ) : (
        <InstagramPreviewCard
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

export default InstagramPostCard

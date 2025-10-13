import { useRouter } from '@tanstack/react-router'
import { format } from 'date-fns'
import {
  Bookmark,
  Box,
  ChartNoAxesColumn,
  CirclePlus,
  Dot,
  Ellipsis,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  TriangleAlert,
} from 'lucide-react'
import { useEffect } from 'react'

import { POST_WORD_COUNT } from '@/core/config/constant'
import { usePostComposer } from '@/core/hooks/post-preview-composer.hook'
import { useUserState } from '@/core/hooks/user-state.hook'
import { PostPreviewProps } from '@/core/models/post.model'
import { UserSocial } from '@/core/models/social.model'
import { extractUserInitial } from '@/core/utils/common.util'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { Skeleton } from '@/shared/ui/skeleton'
import { Textarea } from '@/shared/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import { cn } from '@/shared/utils'

import PostActions from './PostActions'
import PostAttachmentPreview from './PostAttachmentPreview'
import PostImagePreview from './PostImagePreview'

const TwitterPost = (props: PostPreviewProps) => {
  // -- HOOKS --
  const user = useUserState()
  const router = useRouter()
  const {
    content,
    setContent,
    imagePreviews,
    textareaRef,
    updateSelectionRef,
    addEmoji,
    onDelete,
    removeImageAt,
    removeAttachmentAt,
  } = usePostComposer()

  // -- EFFECTS --
  /**
   * Initialize from parent if provided
   */
  useEffect(() => {
    if (typeof props.initialContent === 'string') {
      setContent(props.initialContent)
    }
  }, [props.initialContent, setContent])

  // -- EARLY RETURNS --
  if (!user || props.loading) {
    return <TwitterPostSkeleton />
  }

  // -- LOCAL VARS --
  const user_social = { ...user.connected_channels.twitter }
  user_social.user_name = user_social.user_name || user.name
  user_social.user_id = user_social.user_id || user.email
  user_social.user_profile_picture =
    user_social.user_profile_picture || user.profile_image
  const overlayClassNames =
    'bg-background/20 dark:bg-background/80 absolute top-0 left-0 z-10 flex h-full w-full flex-col items-center justify-center gap-4 rounded-lg border backdrop-blur-[5px]'
  const isProPlan = user.plan === 'Pro'

  // -- RENDER --
  return (
    <div className="relative">
      {!isProPlan && (
        <div className={overlayClassNames}>
          <p className="font-semibold">
            Upgrade plan to post content on twitter
          </p>
          <Button
            variant="default"
            size="sm"
            onClick={() =>
              router.navigate({
                to: '/payments',
              })
            }
            className="text-xs"
          >
            <Box /> Upgrade Plan
          </Button>
        </div>
      )}

      {!user_social.connected && isProPlan && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="bg-card absolute -top-3 -right-2 z-20 animate-pulse rounded-full border-1 p-1 text-yellow-500">
              <TriangleAlert className="size-4" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Twitter not connected</p>
          </TooltipContent>
        </Tooltip>
      )}

      {!props.notEditable && user_social.connected && (
        <div className="my-3 flex justify-center lg:my-0 lg:justify-end">
          {!props.isActionLoading && (
            <div className="lg:absolute lg:top-0 lg:-right-10">
              <PostActions
                onEmojiSelect={addEmoji}
                onDelete={() => {
                  onDelete()
                  props.onContentChange?.('')
                  props.handlePostDelete?.()
                }}
                hideDelete={props.hideDelete}
              />
            </div>
          )}
        </div>
      )}
      <div
        className={cn(
          'bg-card relative flex h-fit gap-2 rounded-lg border-1 p-4',
          props.isActionLoading && 'opacity-50'
        )}
      >
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
          <TwitterPostHeader user={user_social} />

          {/* Content */}
          {props.notEditable ? (
            <p className="p-0 pt-1 text-sm break-words whitespace-pre-wrap">
              {content}
            </p>
          ) : (
            <Textarea
              className={cn(
                'min-h-32 resize-none !bg-transparent !pl-0 md:min-h-20',
                'border-0 p-4 pt-1 shadow-none',
                'caret-primary placeholder:text-muted-foreground/60 selection:bg-brand-accent-yellow selection:text-black',
                'transition-colors duration-200',
                'focus:border-0 focus:shadow-none focus:ring-0 focus:outline-none',
                'focus-visible:border-transparent focus-visible:shadow-none focus-visible:ring-0'
              )}
              placeholder="What's on your mind?"
              ref={textareaRef}
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
          )}

          {/* Image Preview */}
          <div className="overflow-hidden rounded-lg">
            <PostImagePreview
              imagePreviews={imagePreviews}
              onRemove={props.isActionLoading ? undefined : removeImageAt}
            />
          </div>

          {/* Attachments */}
          <PostAttachmentPreview
            attachedFiles={[]}
            onRemove={props.isActionLoading ? undefined : removeAttachmentAt}
          />

          {/* Footer */}
          <TwitterPostFooter />
        </div>
      </div>

      {/* Extra Actions */}
      {!props.notEditable && <TwitterPostFooterActions content={content} />}
    </div>
  )
}

const TwitterPostHeader = ({ user }: { user: UserSocial }) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex w-fit min-w-0 items-center text-sm sm:text-base">
        <span className="max-w-[120px] truncate font-semibold sm:max-w-[160px]">
          {user.user_name}
        </span>
        <span className="max-w-[140px] truncate pl-2 text-gray-500 sm:max-w-[200px] dark:text-gray-400">
          @{user.user_id}
        </span>
        <Dot className="size-5 flex-shrink-0 dark:text-gray-400" />
        <span className="flex-shrink-0 text-gray-500 dark:text-gray-400">
          {format(new Date(), 'MMM d')}
        </span>
      </div>
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
        <Ellipsis className="size-4" />
      </div>
    </div>
  )
}

const TwitterPostFooter = () => {
  return (
    <div className="flex justify-between pt-2">
      <p className="flex items-center gap-1 text-xs font-medium sm:text-sm">
        <MessageCircle className="size-4 text-blue-600" />
        <span className="hidden text-gray-500 sm:inline dark:text-gray-200">
          220
        </span>
      </p>
      <p className="flex items-center gap-1 text-xs font-medium sm:text-sm">
        <Repeat2 className="size-4.5 text-yellow-500" />
        <span className="hidden text-gray-500 sm:inline dark:text-gray-200">
          1.7K
        </span>
      </p>
      <p className="flex items-center gap-1 text-xs font-medium sm:text-sm">
        <Heart className="size-4 text-red-600" />
        <span className="hidden text-gray-500 sm:inline dark:text-gray-200">
          9k
        </span>
      </p>
      <p className="flex items-center gap-1 text-xs font-medium sm:text-sm">
        <ChartNoAxesColumn className="size-4 text-green-600" />
        <span className="hidden text-gray-500 sm:inline dark:text-gray-200">
          513k
        </span>
      </p>
      <div className="flex items-center gap-1 text-pink-600">
        <Bookmark className="size-4" />
        <Share className="size-4" />
      </div>
    </div>
  )
}

const TwitterPostFooterActions = ({ content }: { content: string }) => {
  const maxChars = POST_WORD_COUNT.Twitter
  const usedChars = content.length

  // Determine text color based on character count
  const textColor =
    usedChars >= maxChars
      ? 'text-red-600 dark:text-red-400'
      : usedChars >= maxChars * 0.5
        ? 'text-yellow-600 dark:text-yellow-400'
        : ''

  return (
    <div className="mt-2 flex items-center justify-end gap-2 lg:mt-2">
      <p className={cn('text-xs', textColor)}>
        {usedChars}/{maxChars}
      </p>
      <Separator orientation="vertical" className="!h-4" />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="size-6">
            <CirclePlus />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Threads coming soon !</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export default TwitterPost

export const TwitterPostSkeleton = () => {
  return (
    <div className="bg-card relative flex h-fit gap-2 rounded-lg border-1 p-4">
      {/* Avatar */}
      <Skeleton className="h-10 w-10 rounded-full md:h-12 md:w-12" />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex w-fit min-w-0 items-center">
            <Skeleton className="h-10 w-28 sm:w-40" />
            <Skeleton className="ml-2 h-10 w-24 sm:w-32" />
          </div>
        </div>

        {/* Media preview */}
        <div className="pt-4">
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>

        {/* Footer */}
        <div className="flex justify-between pt-4">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
        </div>
      </div>
    </div>
  )
}

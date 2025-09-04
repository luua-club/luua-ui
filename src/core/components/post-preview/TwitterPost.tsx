import { format } from 'date-fns'
import {
  Bookmark,
  ChartNoAxesColumn,
  Dot,
  Ellipsis,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  TriangleAlert,
} from 'lucide-react'
import { useEffect } from 'react'

import { usePostComposer } from '@/core/hooks/post-preview-composer.hook'
import { useUserState } from '@/core/hooks/user-state.hook'
import { UserSocial } from '@/core/models/social.model'
import { extractUserInitial } from '@/core/utils/common.util'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Skeleton } from '@/shared/ui/skeleton'
import { Textarea } from '@/shared/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import { cn } from '@/shared/utils'

import PostActions from './PostActions'
import PostAttachmentPreview from './PostAttachmentPreview'
import PostImagePreview from './PostImagePreview'

interface TwitterPostProps {
  onContentChange?: (content: string) => void
  initialContent?: string
  loading?: boolean
  handlePostDelete?: () => void
  isActionLoading?: boolean
  notEditable?: boolean
}

const TwitterPost = ({
  onContentChange,
  initialContent,
  loading = false,
  handlePostDelete,
  isActionLoading = false,
  notEditable = false,
}: TwitterPostProps) => {
  const user = useUserState()

  const {
    content,
    setContent,
    attachedFiles,
    setAttachedFiles,
    imagePreviews,
    textareaRef,
    updateSelectionRef,
    addEmoji,
    onDelete,
    removeImageAt,
    removeAttachmentAt,
  } = usePostComposer()

  // Initialize from parent if provided
  useEffect(() => {
    if (typeof initialContent === 'string') {
      setContent(initialContent)
    }
  }, [initialContent])

  if (!user || loading) {
    return <TwitterPostSkeleton />
  }

  const user_social = { ...user.connected_channels.twitter }

  user_social.user_name = user_social.user_name || user.name
  user_social.user_id = user_social.user_id || user.email
  user_social.user_profile_picture =
    user_social.user_profile_picture || user.profile_image

  return (
    <>
      <div
        className={cn(
          'bg-card relative flex h-fit gap-2 rounded-lg border-1 p-4',
          isActionLoading && 'opacity-50'
        )}
      >
        {!user_social.connected && (
          <div className="bg-card absolute -top-3 -right-3 flex size-7 items-center justify-center rounded-full border-1 border-dashed">
            <Tooltip>
              <TooltipTrigger>
                <TriangleAlert className="size-4 animate-pulse text-yellow-600" />
              </TooltipTrigger>
              <TooltipContent>
                <span>Twitter account not connected</span>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

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
          {notEditable ? (
            <p className="p-0 pt-1 text-sm break-words whitespace-pre-wrap">
              {content}
            </p>
          ) : (
            <Textarea
              className={cn(
                // Base visuals and typography
                'resize-none border-0 p-0 pt-1 shadow-none',
                // Caret, placeholder and selection for a premium feel
                'caret-primary placeholder:text-muted-foreground/60 selection:bg-brand-accent-yellow selection:text-black',
                // Smooth color transitions
                'transition-colors duration-200',
                // Remove focus visuals completely (Textarea base adds focus-visible ring + border)
                'focus:border-0 focus:shadow-none focus:ring-0 focus:outline-none',
                'focus-visible:border-transparent focus-visible:shadow-none focus-visible:ring-0'
              )}
              placeholder="What's on your mind?"
              ref={textareaRef}
              value={content}
              maxLength={280}
              onChange={e => {
                const val = e.target.value
                setContent(val)
                onContentChange?.(val)
              }}
              onSelect={updateSelectionRef}
              onKeyUp={updateSelectionRef}
              onClick={updateSelectionRef}
              disabled={isActionLoading}
            />
          )}

          {/* Image Preview */}
          <div className="overflow-hidden rounded-lg">
            <PostImagePreview
              imagePreviews={imagePreviews}
              onRemove={isActionLoading ? undefined : removeImageAt}
            />
          </div>

          {/* Attachments */}
          <PostAttachmentPreview
            attachedFiles={attachedFiles}
            onRemove={isActionLoading ? undefined : removeAttachmentAt}
          />

          {/* Footer */}
          <TwitterPostFooter />
        </div>
      </div>
      {!notEditable && (
        <div className="mt-2 flex justify-end">
          {!isActionLoading && (
            <PostActions
              maxFiles={4}
              attachedFiles={attachedFiles}
              onFilesChange={files => {
                setAttachedFiles(files)
              }}
              onEmojiSelect={addEmoji}
              onDelete={() => {
                onDelete()
                onContentChange?.('')
                handlePostDelete?.()
              }}
            />
          )}
        </div>
      )}
    </>
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

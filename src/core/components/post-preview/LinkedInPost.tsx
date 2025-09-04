import {
  Dot,
  Ellipsis,
  Heart,
  MessageCircleMore,
  Repeat2,
  Send,
  Smile,
  ThumbsUp,
  TriangleAlert,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { usePostComposer } from '@/core/hooks/post-preview-composer.hook'
import { UserSocial } from '@/core/models/social.model'
import { extractUserInitial } from '@/core/utils/common.util'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { Textarea } from '@/shared/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import { cn } from '@/shared/utils'

import { useUserState } from '../../hooks/user-state.hook'
import PostActions from './PostActions'
import PostAttachmentPreview from './PostAttachmentPreview'
import PostImagePreview from './PostImagePreview'

interface LinkedInPostProps {
  onContentChange?: (content: string) => void
  initialContent?: string
  loading?: boolean
  handlePostDelete?: () => void
  isActionLoading?: boolean
  notEditable?: boolean
}

const LinkedInPost = ({
  onContentChange,
  initialContent,
  loading = false,
  handlePostDelete,
  isActionLoading = false,
  notEditable = false,
}: LinkedInPostProps) => {
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

  // Read-more toggle for not-editable view
  const [expanded, setExpanded] = useState(false)

  // Initialize from parent if provided
  useEffect(() => {
    if (typeof initialContent === 'string') {
      setContent(initialContent)
    }
  }, [initialContent])

  if (!user || loading) {
    return <LinkedInPostSkeleton />
  }

  const user_social = { ...user.connected_channels.linkedin }

  user_social.user_name = user_social.user_name || user.name
  user_social.user_id = user_social.user_id || user.email
  user_social.user_profile_picture =
    user_social.user_profile_picture || user.profile_image

  // Prepare truncated display text (300 characters)
  const MAX_CHARS = 300
  const raw = content || ''
  const isLong = raw.length > MAX_CHARS
  const displayText =
    expanded || !isLong ? raw : raw.slice(0, MAX_CHARS).trimEnd() + '...'

  return (
    <>
      <div
        className={cn(
          'bg-card relative rounded-lg border-1',
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
                <span>LinkedIn account not connected</span>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Header */}
        <LinkedInPostHeader user={user_social} />

        {/* Content */}
        {notEditable ? (
          <div className="p-4 pt-1 text-sm">
            <p className="break-words whitespace-pre-wrap">{displayText}</p>
            {isLong && (
              <Button
                variant="link"
                className="!p-0 text-xs text-blue-600 dark:text-blue-300"
                onClick={() => setExpanded(prev => !prev)}
              >
                {expanded ? 'See less' : 'See more'}
              </Button>
            )}
          </div>
        ) : (
          <Textarea
            className={cn(
              'min-h-20',
              // Base visuals and typography
              'resize-none border-0 p-4 pt-1 shadow-none',
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
            maxLength={3000}
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
        <PostImagePreview
          imagePreviews={imagePreviews}
          onRemove={isActionLoading ? undefined : removeImageAt}
        />

        {/* Attachments */}
        <PostAttachmentPreview
          attachedFiles={attachedFiles}
          onRemove={isActionLoading ? undefined : removeAttachmentAt}
        />

        {/* Footer */}
        <LinkedInPostFooter />
      </div>
      {!notEditable && (
        <div className="mt-2 flex justify-end">
          {!isActionLoading && (
            <PostActions
              maxFiles={8}
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

const LinkedInPostHeader = ({ user }: { user: UserSocial }) => {
  return (
    <div className="flex items-start justify-between px-4 py-2">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <Avatar className={cn('shrink-0 rounded-full', 'h-12 w-12')}>
          <AvatarImage
            src={user.user_profile_picture ?? undefined}
            alt={user.user_name}
          />
          <AvatarFallback>{extractUserInitial(user.user_name)}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
          <h6 className="block max-w-full min-w-0 truncate text-sm font-medium whitespace-nowrap sm:text-base">
            {user.user_name}
          </h6>
          <p className="truncate text-xs font-medium text-gray-400 dark:text-gray-300">
            CEO of Copy-Pasting Content
          </p>
        </div>
      </div>
      <div className="flex gap-4 text-gray-400 dark:text-gray-300">
        <Ellipsis className="size-5" />
      </div>
    </div>
  )
}

const LinkedInPostFooter = () => {
  return (
    <div className="flex flex-col gap-2 px-4 pt-2 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <div className="rounded-full border-1 border-dotted bg-blue-200 p-1 dark:bg-blue-300 dark:text-black">
              <ThumbsUp className="size-2 sm:size-3" />
            </div>
            <div className="rounded-full border-1 border-dotted bg-red-200 p-1 dark:bg-red-300 dark:text-black">
              <Heart className="size-2 sm:size-3" />
            </div>
            <div className="rounded-full border-1 border-dotted bg-yellow-200 p-1 dark:bg-yellow-300 dark:text-black">
              <Smile className="size-2 sm:size-3" />
            </div>
          </div>
          <p className="dark:text-card-foreground text-xs text-gray-600 sm:text-sm">
            22,636
          </p>
        </div>
        <p className="dark:text-card-foreground flex items-center text-xs text-gray-600 sm:text-sm">
          745 comments <Dot className="size-2 sm:size-3" /> 229 reposts
        </p>
      </div>
      <hr />
      <div className="flex justify-around">
        <p className="flex items-center gap-1 text-xs font-medium sm:text-sm">
          <ThumbsUp className="size-4" />
          <span className="hidden sm:inline">Like</span>
        </p>
        <p className="flex items-center gap-1 text-xs font-medium sm:text-sm">
          <MessageCircleMore className="size-4" />
          <span className="hidden sm:inline">Comment</span>
        </p>
        <p className="flex items-center gap-1 text-xs font-medium sm:text-sm">
          <Repeat2 className="size-4" />
          <span className="hidden sm:inline">Repost</span>
        </p>
        <p className="flex items-center gap-1 text-xs font-medium sm:text-sm">
          <Send className="size-4" />
          <span className="hidden sm:inline">Send</span>
        </p>
      </div>
    </div>
  )
}

export const LinkedInPostSkeleton = () => {
  return (
    <div className="bg-card relative rounded-lg border-1">
      {/* Header */}
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-2">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex min-w-0 flex-col">
          <Skeleton className="mb-1 h-4 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>

      {/* Media preview */}
      <div className="p-4">
        <Skeleton className="h-40 w-full rounded-md" />
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-2 px-4 pt-2 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-10" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
        <hr />
        <div className="flex justify-around">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default LinkedInPost

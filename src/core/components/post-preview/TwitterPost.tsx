import { format } from 'date-fns'
import {
  Bookmark,
  ChartNoAxesColumn,
  CircleOff,
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
import { IUserConnectedChannel } from '@/core/models/social.model'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Textarea } from '@/shared/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import { cn } from '@/shared/utils'

import { PostSkeleton } from '../Post'
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
    return <PostSkeleton />
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
          'relative flex h-fit gap-2 rounded-lg border-1 p-4',
          isActionLoading && 'opacity-50'
        )}
      >
        {!user_social.connected && (
          <div className="absolute -top-3 -right-3 flex size-7 items-center justify-center rounded-full border-1 border-dashed bg-white">
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
          <AvatarFallback>{'DL'}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <TwitterPostHeader user={user_social} />

          {/* Content */}
          {notEditable ? (
            <p className="p-0 pt-1 text-sm">{content}</p>
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

const TwitterPostHeader = ({ user }: { user: IUserConnectedChannel }) => {
  return (
    <div className="grid w-full grid-cols-[1fr_auto] items-center gap-2">
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2 text-sm sm:text-base">
          <span className="w-0 min-w-0 flex-1 truncate font-semibold whitespace-nowrap">
            {user.user_name}
          </span>
          <span className="w-0 min-w-0 flex-1 truncate whitespace-nowrap text-gray-500">
            @{user.user_id}
          </span>
          <Dot className="size-3 shrink-0" />
          <span className="shrink-0 whitespace-nowrap text-gray-500">
            {format(new Date(), 'MMM d')}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 text-gray-500">
        <CircleOff className="hidden size-4 sm:block" />
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
        <span className="hidden text-gray-500 sm:inline">220</span>
      </p>
      <p className="flex items-center gap-1 text-xs font-medium sm:text-sm">
        <Repeat2 className="size-4.5 text-yellow-500" />
        <span className="hidden text-gray-500 sm:inline">1.7K</span>
      </p>
      <p className="flex items-center gap-1 text-xs font-medium sm:text-sm">
        <Heart className="size-4 text-red-600" />
        <span className="hidden text-gray-500 sm:inline">9k</span>
      </p>
      <p className="flex items-center gap-1 text-xs font-medium sm:text-sm">
        <ChartNoAxesColumn className="size-4 text-green-600" />
        <span className="hidden text-gray-500 sm:inline">513k</span>
      </p>
      <div className="flex items-center gap-1 text-pink-600">
        <Bookmark className="size-4" />
        <Share className="size-4" />
      </div>
    </div>
  )
}

export default TwitterPost

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
} from 'lucide-react'
import { useEffect } from 'react'

import { usePostComposer } from '@/core/hooks/post-preview-composer.hook'
import { useUserState } from '@/core/hooks/user-state.hook'
import { IUserConnectedChannel } from '@/core/models/social.model'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Textarea } from '@/shared/ui/textarea'
import { cn } from '@/shared/utils'

import { PostSkeleton } from '../Post'
import PostActions from './PostActions'
import PostAttachmentPreview from './PostAttachmentPreview'
import PostImagePreview from './PostImagePreview'

interface TwitterPostProps {
  onContentChange?: (content: string) => void
  initialContent?: string
  loading?: boolean
}

const TwitterPost = ({
  onContentChange,
  initialContent,
  loading = false,
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

  return (
    <>
      <div className="flex gap-2 rounded-lg border-1 p-4">
        <Avatar className="!h-10 !w-10 md:!h-12 md:!w-12">
          <AvatarImage
            src={user_social.user_profile_picture}
            alt={user_social.user_name}
          />
          <AvatarFallback>{'DL'}</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <TwitterPostHeader user={user_social} />

          {/* Content */}
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
          />

          {/* Image Preview */}
          <div className="overflow-hidden rounded-lg">
            <PostImagePreview
              imagePreviews={imagePreviews}
              onRemove={removeImageAt}
            />
          </div>

          {/* Attachments */}
          <PostAttachmentPreview
            attachedFiles={attachedFiles}
            onRemove={removeAttachmentAt}
          />

          {/* Footer */}
          <TwitterPostFooter />
        </div>
      </div>
      <div className="mt-2 flex justify-end">
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
          }}
        />
      </div>
    </>
  )
}

const TwitterPostHeader = ({ user }: { user: IUserConnectedChannel }) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
        <p className="truncate font-semibold">{user.user_name}</p>
        <p className="flex items-center truncate text-gray-500">
          @{user.user_id} <Dot className="size-3" />
          {format(new Date(), 'MMM d')}
        </p>
      </div>
      <div className="flex items-center gap-2 text-gray-500">
        <CircleOff className="hidden size-4 sm:block" />
        <Ellipsis className="size-4" />
      </div>
    </div>
  )
}

const TwitterPostFooter = () => {
  return (
    <div className="flex justify-between pt-2">
      <p className="flex items-center gap-1 text-xs font-medium text-gray-500 sm:text-sm">
        <MessageCircle className="size-4" />
        <span className="hidden sm:inline">220</span>
      </p>
      <p className="flex items-center gap-1 text-xs font-medium text-gray-500 sm:text-sm">
        <Repeat2 className="size-4" />
        <span className="hidden sm:inline">1.7K</span>
      </p>
      <p className="flex items-center gap-1 text-xs font-medium text-gray-500 sm:text-sm">
        <Heart className="size-4" />
        <span className="hidden sm:inline">9k</span>
      </p>
      <p className="flex items-center gap-1 text-xs font-medium text-gray-500 sm:text-sm">
        <ChartNoAxesColumn className="size-4" />
        <span className="hidden sm:inline">513k</span>
      </p>
      <div className="flex items-center gap-1 text-gray-500">
        <Bookmark className="size-4" />
        <Share className="size-4" />
      </div>
    </div>
  )
}

export default TwitterPost

import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import { cn } from '@/shared/utils'

import { SOCIAL_PLATFORM } from '../config/constant'
import { useUserState } from '../hooks/user-state.hook'
import { IPost } from '../models/post.model'
import { ProjectSocial } from '../models/social.model'
import { extractUserInitial } from '../utils/common.util'
import ThumbnailImage from './ThumbnailImage'

type PostProps = IPost & {
  isLoading?: boolean
  tileView?: boolean
  maintainFormatting?: boolean
  noBorder?: boolean
}

function Post({
  channel,
  content,
  attached_media,
  isLoading = false,
  tileView = false,
  maintainFormatting = false,
  noBorder = false,
}: PostProps) {
  // Read-more toggle for not-editable view
  const [expanded, setExpanded] = useState(false)

  const platform = SOCIAL_PLATFORM.find(s => s.name === channel)
  const userState = useUserState()
  const connectedChannels = userState?.connectedChannels

  if (!userState || isLoading) {
    return <PostSkeleton tileView={tileView} />
  }

  const channelUser: ProjectSocial | undefined =
    platform?.name === 'LinkedIn'
      ? connectedChannels?.linkedin
      : connectedChannels?.twitter

  let user: {
    name: string
    username: string
    image: string
  } = {
    name: userState.name,
    username: userState.email,
    image: userState.profile_image ?? '',
  }

  if (channelUser) {
    user = {
      name: channelUser.user_name || userState.name,
      username: channelUser.user_id
        ? platform?.name === 'Twitter'
          ? `@${channelUser.user_id}`
          : channelUser.user_email
        : userState.email,
      image: channelUser.user_profile_picture ?? userState.profile_image ?? '',
    }
  }

  const MAX_CHARS = 300
  const raw = content || ''
  const isLong = raw.length > MAX_CHARS
  const displayText =
    expanded || !isLong
      ? content
      : content.slice(0, MAX_CHARS).trimEnd() + '...'

  return (
    <Card
      className={cn(
        'bg-card relative flex flex-col rounded-md p-0 shadow-none',
        tileView ? 'min-h-auto' : 'h-fit',
        noBorder && 'border-none'
      )}
    >
      <CardContent className="flex flex-1 flex-col border-none p-0">
        {/** USER INFO */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3">
          {/** AVATAR */}
          <Avatar
            className={cn(
              'shrink-0 rounded-full',
              tileView ? 'h-10 w-10' : 'h-12 w-12'
            )}
          >
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>{extractUserInitial(user.name)}</AvatarFallback>
          </Avatar>

          {/** USER INFO */}
          <div className="flex min-w-0 flex-col">
            <div className="flex min-w-0 items-center gap-2 text-sm font-medium sm:text-base">
              <h6 className="truncate">{user.name}</h6>
            </div>
            <p className="truncate text-xs font-medium text-zinc-400">
              {user.username}
            </p>
          </div>

          {/** SOCIAL LOGO */}
          {platform && platform.logo && (
            <div className="dark:bg-card rounded-full border-1 border-dashed p-3">
              <platform.logo className="size-5" />
            </div>
          )}
        </div>

        {/** SEPARATOR */}
        {!tileView && <hr />}

        {/** CONTENT */}
        {(displayText.length > 0 || content.length > 0) &&
          (maintainFormatting ? (
            <div className="p-4 pt-3 text-sm">
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
            <p
              className={cn(
                'text-card-foreground my-4 px-4 text-sm',
                tileView ? 'mt-0 line-clamp-3' : undefined
              )}
            >
              {content}
            </p>
          ))}

        {attached_media && attached_media.length > 0 && (
          <div
            className={cn(
              'flex flex-col gap-2 p-4',
              content.length > 0 && 'pt-0'
            )}
          >
            <p className="text-xs font-bold">
              Attachments ({attached_media.length})
            </p>
            <div className="flex gap-2 overflow-x-auto">
              {attached_media.map((image, index) => (
                <ThumbnailImage
                  key={index}
                  src={image.thumbnail || image.url}
                  alt={`attachment-${index}`}
                  className="h-12 w-12 flex-shrink-0"
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export const PostSkeleton = ({
  tileView = false,
  noBorder = false,
}: {
  tileView?: boolean
  noBorder?: boolean
}) => {
  return (
    <Card
      className={cn(
        'relative flex min-h-52 flex-col overflow-hidden rounded-md p-0 shadow-none',
        tileView ? 'min-h-36' : 'h-fit',
        noBorder && 'border-none'
      )}
    >
      <CardContent className="flex flex-1 flex-col p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex flex-col pl-2">
              <Skeleton className="mb-1 h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        {!tileView && <hr />}
        <div className="mt-3 space-y-2 px-4">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </CardContent>
    </Card>
  )
}

export default Post

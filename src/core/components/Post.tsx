import { Paperclip, TriangleAlert } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Card, CardContent } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import { cn } from '@/shared/utils'

import { SOCIAL_PLATFORM } from '../config/constant'
import { useUserState } from '../hooks/user-state.hook'
import { IPost } from '../models/post.model'
import { IUserConnectedChannel } from '../models/social.model'

type PostProps = IPost & {
  isLoading?: boolean
  fullView?: boolean
  tileView?: boolean
}

function Post({
  channel,
  content,
  attached_media,
  isLoading = false,
  fullView = false,
  tileView = false,
}: PostProps) {
  const platform = SOCIAL_PLATFORM.find(s => s.name === channel)
  const userState = useUserState()

  if (!userState) {
    return null
  }

  const channelUser: IUserConnectedChannel | undefined =
    platform?.name === 'LinkedIn'
      ? userState?.connected_channels?.linkedin
      : userState?.connected_channels?.twitter

  let user: {
    name: string
    username: string
    image: string
  } = {
    name: userState.name,
    username: '',
    image: userState.profile_image,
  }

  if (channelUser) {
    user = {
      name: channelUser.user_name || userState.name,
      username: channelUser.user_id || '',
      image: channelUser.user_profile_picture || userState.profile_image,
    }
  }

  if (isLoading) {
    return <PostSkeleton />
  }

  return (
    <Card
      className={cn(
        'relative flex flex-col rounded-md p-0 shadow-none',
        fullView ? 'h-fit' : 'min-h-52 overflow-hidden',
        tileView ? 'min-h-30' : 'h-fit'
      )}
    >
      <CardContent className="flex flex-1 flex-col p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <Avatar
              className={cn(
                'rounded-full',
                tileView ? 'h-10 w-10' : 'h-12 w-12'
              )}
            >
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>{'DL'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col pl-2">
              <div className="flex items-center gap-2 text-base font-medium">
                <h6>{user.name}</h6>
                {!channelUser.connected && (
                  <Tooltip>
                    <TooltipTrigger>
                      <TriangleAlert className="size-4 animate-pulse text-yellow-600" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>{platform?.name} account not connected</span>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              {user.username && (
                <p className="text-xs font-medium text-gray-400">
                  {user.username}
                </p>
              )}
            </div>
          </div>

          {platform && platform.logo && (
            <platform.logo className="size-10 rounded-full border-1 border-dashed p-2" />
          )}
        </div>
        {!tileView && <hr />}
        <p
          className={cn(
            'mt-3 px-4 text-sm text-gray-600',
            fullView ? 'pb-4' : 'line-clamp-5',
            tileView ? 'mt-0 line-clamp-2' : 'line-clamp-5'
          )}
        >
          {content}
        </p>

        {attached_media && attached_media.length !== 0 && !tileView && (
          <>
            <span className="absolute right-1 bottom-0 flex items-center justify-center p-2 text-[10px] text-gray-400">
              <Paperclip className="size-3" />+{attached_media.length}
            </span>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export const PostSkeleton = () => {
  return (
    <Card className="relative flex min-h-52 flex-col overflow-hidden rounded-md p-0 shadow-none">
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
        <hr />
        <div className="mt-3 space-y-2 px-4">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </CardContent>
    </Card>
  )
}

export default Post

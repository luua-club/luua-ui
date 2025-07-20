import { Paperclip } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Card, CardContent } from '@/shared/ui/card'

import { SOCIAL_PLATFORM } from '../config/constant'
import { IPost } from '../models/post.model'

type PostProps = IPost

function Post({ channel, content, attachedMedia }: PostProps) {
  const platform = SOCIAL_PLATFORM.find(s => s.name === channel)

  //TODO: get user from context
  const user = {
    name: 'shadcn',
    username: '@shadcn',
    image: 'https://github.com/shadcn.png',
  }

  return (
    <Card className="relative flex min-h-52 flex-col overflow-hidden rounded-md p-0 shadow-none">
      <CardContent className="flex flex-1 flex-col p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <Avatar className="bg-accent h-12 w-12 rounded-full">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>{'DL'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col pl-2">
              <h6 className="text-base font-medium">{user.name}</h6>
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
        <hr />
        <p className="mt-3 line-clamp-5 px-4 text-sm text-gray-600">
          {content}
        </p>

        {attachedMedia && attachedMedia.length !== 0 && (
          <>
            <span className="absolute right-1 bottom-0 flex items-center justify-center p-2 text-[10px] text-gray-400">
              <Paperclip className="size-3" />+{attachedMedia.length}
            </span>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default Post

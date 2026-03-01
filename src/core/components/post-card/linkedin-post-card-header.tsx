import { ProjectSocial } from '@/core/models/social.model'
import { extractUserInitial } from '@/core/utils/common.util'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { cn } from '@/shared/utils'

interface LinkedInPostCardHeaderProps {
  channel: ProjectSocial
}

function LinkedInPostCardHeader({ channel }: LinkedInPostCardHeaderProps) {
  return (
    <div className="flex items-start justify-between px-4 py-2">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        {/* Avatar */}
        <Avatar className={cn('shrink-0 rounded-full', 'h-12 w-12')}>
          <AvatarImage
            src={channel.user_profile_picture ?? undefined}
            alt={channel.user_name}
          />
          <AvatarFallback>
            {extractUserInitial(channel.user_name)}
          </AvatarFallback>
        </Avatar>

        {/* Name */}
        <div className="flex min-w-0 flex-col">
          <h6 className="block max-w-full min-w-0 truncate text-sm font-medium whitespace-nowrap sm:text-base">
            {channel.user_name}
          </h6>
          <p className="text-muted-foreground text-xs">{channel.user_id}</p>
        </div>
      </div>
    </div>
  )
}

export default LinkedInPostCardHeader

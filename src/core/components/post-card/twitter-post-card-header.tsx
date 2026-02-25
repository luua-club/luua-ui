import { format } from 'date-fns/format'
import { Dot } from 'lucide-react'

import { ProjectSocial } from '@/core/models/social.model'

function TwitterPostCardHeader({ channel }: { channel: ProjectSocial }) {
  return (
    <div className="flex w-fit min-w-0 items-center text-sm sm:text-base">
      {/* Name */}
      <span className="max-w-[120px] truncate font-semibold sm:max-w-[160px]">
        {channel.user_name}
      </span>

      {/* Username */}
      <span className="max-w-[140px] truncate pl-2 text-gray-500 sm:max-w-[200px] dark:text-gray-400">
        @{channel.user_id}
      </span>

      {/* Date */}
      <Dot className="size-5 flex-shrink-0 dark:text-gray-400" />
      <span className="flex-shrink-0 text-gray-500 dark:text-gray-400">
        {format(new Date(), 'MMM d')}
      </span>
    </div>
  )
}

export default TwitterPostCardHeader

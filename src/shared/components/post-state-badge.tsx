import { FileText } from 'lucide-react'

import { Badge } from '../ui/badge'

export const DraftBadge = () => {
  return (
    <Badge
      variant="secondary"
      className="gap-1 rounded-full border border-blue-300 bg-blue-300/50 text-xs font-medium dark:border-blue-700/60 dark:bg-blue-900/40 dark:text-blue-300"
    >
      <FileText className="size-3" />
      Draft
    </Badge>
  )
}

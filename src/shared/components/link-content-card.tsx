import { format } from 'date-fns'
import { Edit2, Trash2 } from 'lucide-react'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'

interface LinkContentCardProps {
  createdAt: string
  description?: string
  isProcessing?: boolean
  link: string
  onDelete?: () => void
  onEdit?: () => void
  utilized?: boolean
}

function LinkContentCard({
  link,
  description,
  createdAt,
  utilized = false,
  onEdit,
  onDelete,
  isProcessing = false,
}: LinkContentCardProps) {
  return (
    <Card
      className={`flex flex-col gap-4 py-4 shadow-none ${isProcessing ? 'opacity-50' : ''}`}
    >
      {/* Header */}
      <CardHeader className="flex items-start justify-between gap-2 px-4">
        {/* Title */}
        <CardTitle className="min-w-0 flex-1">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary line-clamp-2 max-w-full overflow-hidden text-sm break-words whitespace-normal underline-offset-4 hover:underline"
          >
            {link}
          </a>
        </CardTitle>

        {/* Utilized Badge */}
        {utilized && (
          <Badge className="border-transparent bg-blue-600 text-xs text-white">
            Utilized
          </Badge>
        )}
      </CardHeader>

      {/* Content */}
      <CardContent className="line-clamp-3 flex-1 px-4">
        {/* Additional Context */}
        <p className="text-muted-foreground text-sm break-words">
          {description}
        </p>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex items-center justify-between gap-2 px-4 text-xs">
        {/* Created At */}
        {format(new Date(createdAt), 'PPpp')}

        {/** Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={onEdit}
            disabled={isProcessing}
          >
            <Edit2 />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="size-7"
            onClick={onDelete}
            disabled={isProcessing}
          >
            <Trash2 />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default LinkContentCard

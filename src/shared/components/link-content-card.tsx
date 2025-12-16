import { format } from 'date-fns'
import { Edit2, PencilRuler, Trash2 } from 'lucide-react'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { cn } from '../utils'

interface LinkContentCardProps {
  createdAt: string
  description?: string
  isProcessing?: boolean
  link: string
  onDelete?: () => void
  onEdit?: () => void
  onCreate?: () => void
  utilized?: boolean
}

function LinkContentCard({
  link,
  description,
  createdAt,
  utilized = false,
  onEdit,
  onDelete,
  onCreate,
  isProcessing = false,
}: LinkContentCardProps) {
  return (
    <Card
      className={`flex flex-col gap-2 rounded-sm p-0 shadow-none ${isProcessing ? 'opacity-50' : ''} relative`}
    >
      {/* Header */}
      <CardHeader className="flex items-start justify-between gap-2 px-4 pt-4">
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
      </CardHeader>

      {/* Content */}
      <CardContent className="line-clamp-3 flex-1 px-4">
        {/* Additional Context */}
        <p className="text-muted-foreground text-sm break-words">
          {description}
        </p>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex flex-col p-0 pt-2">
        <div className="flex w-full flex-col justify-between gap-4 px-4 text-xs lg:flex-row lg:items-center">
          <p className="text-muted-foreground font-semibold">
            {format(new Date(createdAt), 'PP')}
          </p>

          <Badge
            variant="default" 
            className={cn(
              'rounded-sm bg-slate-100 border-slate-600 text-xs font-semibold text-slate-600 opacity-0 dark:bg-slate-800 dark:border-slate-400 dark:text-slate-400',
              utilized && 'opacity-100'
            )}
          >
            Processed
          </Badge>
        </div>

        {/** Actions */}
        <div className="mt-4 grid w-full grid-cols-2 gap-4 border-t-1 px-4 py-4">
          <Button variant="default" className="w-full" onClick={onCreate}>
            <PencilRuler /> Create
          </Button>
          <Button
            variant="outline"
            onClick={onEdit}
            disabled={isProcessing}
            className="w-full"
          >
            <Edit2 /> Edit
          </Button>
        </div>
      </CardFooter>
      <div className="absolute -top-2.5 -right-2.5">
        <Button
          variant="outline"
          size={'icon'}
          onClick={onDelete}
          disabled={isProcessing}
          className="dark:bg-card dark:hover:bg-card size-7 rounded-full text-red-500"
        >
          <Trash2 />
        </Button>
      </div>
    </Card>
  )
}

export default LinkContentCard

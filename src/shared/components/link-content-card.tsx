import { Link } from '@tanstack/react-router'
import { format } from 'date-fns'
import { Edit2, PencilRuler, Trash2 } from 'lucide-react'
import { useState } from 'react'

import luuaIconLogo from '@/assets/logos/luua-icon-logo.svg'
import luuaWhiteIconLogo from '@/assets/logos/luua-white-icon-logo.svg'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { cn } from '../utils'

interface LinkContentCardProps {
  createdAt: string
  title?: string
  description?: string
  additionalContext?: string
  icon?: string
  isProcessing?: boolean
  link: string
  onDelete?: () => void
  onEdit?: () => void
  onCreate?: () => void
  utilized?: boolean
  inspirationId?: string
}

function SourceProfile({
  icon,
  title,
  description,
  link,
}: {
  icon?: string
  title?: string
  description?: string
  link: string
}) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const showFallback = !icon || imgError

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-w-0 items-start gap-3 rounded-md border border-dashed p-3"
    >
      <div className="size-6 shrink-0 overflow-hidden rounded-sm">
        {showFallback ? (
          <>
            <img
              src={luuaIconLogo}
              alt="Luua"
              className="size-full object-cover object-center dark:hidden"
            />
            <img
              src={luuaWhiteIconLogo}
              alt="Luua"
              className="hidden size-full object-cover object-center dark:block"
            />
          </>
        ) : (
          <>
            {!imgLoaded && <Skeleton className="size-full rounded-sm" />}
            <img
              src={icon}
              alt={title || 'icon'}
              className={cn(
                'size-full object-cover object-center',
                !imgLoaded && 'hidden'
              )}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-primary -mt-1 line-clamp-2 text-sm font-semibold break-words underline-offset-4 hover:underline">
          {title || link}
        </p>
        {description && (
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-muted-foreground mt-0.5 line-clamp-1 cursor-default text-xs break-words">
                {description}
              </p>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-72 text-wrap">
              {description}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </a>
  )
}

function LinkContentCard({
  link,
  title,
  description,
  additionalContext,
  icon,
  createdAt,
  utilized = false,
  onEdit,
  onDelete,
  onCreate,
  isProcessing = false,
  inspirationId,
}: LinkContentCardProps) {
  return (
    <Card
      className={`flex flex-col gap-2 rounded-sm p-0 shadow-none ${isProcessing ? 'opacity-50' : ''} relative`}
    >
      {/* Header: Source profile */}
      <CardHeader className="px-4 pt-4">
        <SourceProfile
          icon={icon}
          title={title}
          description={description}
          link={link}
        />
      </CardHeader>

      {/* Content: Additional Context */}
      <CardContent className="line-clamp-3 flex-1 px-4">
        <p
          className={cn(
            'text-muted-foreground text-sm break-words',
            !additionalContext && 'italic'
          )}
        >
          {additionalContext || 'No additional context'}
        </p>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex flex-col p-0 pt-2">
        <div className="flex w-full flex-col justify-between gap-4 px-4 text-xs lg:flex-row lg:items-center">
          <p className="text-muted-foreground font-semibold">
            {format(new Date(createdAt), 'PP')}
          </p>

          {utilized && inspirationId ? (
            <Link
              to="/drafts"
              search={{ inspiration_id: inspirationId }}
              className="inline-block"
            >
              <Badge
                variant="default"
                className="cursor-pointer rounded-sm border-slate-600 bg-slate-100 text-xs font-semibold text-slate-600 transition-opacity hover:opacity-80 dark:border-slate-400 dark:bg-slate-800 dark:text-slate-400"
              >
                Drafted by Autopilot
              </Badge>
            </Link>
          ) : (
            <Badge
              variant="default"
              className={cn(
                'rounded-sm border-slate-600 bg-slate-100 text-xs font-semibold text-slate-600 opacity-0 dark:border-slate-400 dark:bg-slate-800 dark:text-slate-400',
                utilized && 'opacity-100'
              )}
            >
              Drafted by Autopilot
            </Badge>
          )}
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

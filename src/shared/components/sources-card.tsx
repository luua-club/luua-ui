import { ExternalLink } from 'lucide-react'

export interface SourceChip {
  url?: string
  title: string
  description: string
}

interface SourcesCardProps extends SourceChip {
  serialNumber: number
}

function SourcesCard({
  url,
  title,
  description,
  serialNumber,
}: SourcesCardProps) {
  return (
    <div className="flex flex-col gap-2">
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex max-w-full cursor-pointer items-center gap-1 truncate text-sm font-semibold hover:underline"
        >
          {serialNumber}. {title} <ExternalLink className="size-3" />
        </a>
      ) : (
        <p className="max-w-full truncate text-sm font-semibold">
          {serialNumber}. {title}
        </p>
      )}
      <p className="text-muted-foreground line-clamp-3 text-xs">
        {description}
      </p>
    </div>
  )
}

export default SourcesCard

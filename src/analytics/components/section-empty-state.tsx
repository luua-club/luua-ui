import { BarChart3 } from 'lucide-react'

import { Card } from '@/shared/ui/card'

type SectionEmptyStateProps = {
  title: string
  description: string
}

export default function SectionEmptyState({
  title,
  description,
}: SectionEmptyStateProps) {
  return (
    <Card className="items-center gap-3 rounded-xl p-8 text-center shadow-none">
      <div className="bg-muted flex size-11 items-center justify-center rounded-md">
        <BarChart3 className="text-muted-foreground size-5" />
      </div>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-muted-foreground max-w-md text-sm">{description}</p>
    </Card>
  )
}

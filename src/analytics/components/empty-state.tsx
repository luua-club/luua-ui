import { BarChart3 } from 'lucide-react'

import { Card } from '@/shared/ui/card'

export default function EmptyState() {
  return (
    <Card className="mx-auto max-w-xl items-center gap-3 rounded-lg p-8 text-center shadow-none">
      <div className="bg-muted flex size-11 items-center justify-center rounded-md">
        <BarChart3 className="text-muted-foreground size-5" />
      </div>
      <p className="text-sm font-medium">No analytics yet</p>
      <p className="text-muted-foreground text-sm">
        Published posts with collected metrics will appear here.
      </p>
    </Card>
  )
}

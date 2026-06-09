import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/index'

export function DashboardDraftsEmptyState() {
  return (
    <div
      className={cn(
        'border-border bg-card/30 relative w-full overflow-hidden rounded-2xl border border-dotted',
        'bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:18px_18px]'
      )}
    >
      <div className="relative flex flex-col items-center gap-2 px-6 py-10 text-center sm:py-12">
        <h2 className="text-xl font-semibold tracking-tight">
          No drafts found
        </h2>
        <p className="text-muted-foreground max-w-sm text-sm leading-relaxed text-balance">
          You haven&apos;t saved any drafts yet. Create a post and it will show
          up here.
        </p>
        <Button
          className="bg-foreground text-background hover:bg-foreground/90 mt-4 h-10 gap-2 rounded-lg px-5 shadow-none"
          asChild
        >
          <Link to="/creation/create">
            <Plus className="size-4" />
            Create post
          </Link>
        </Button>
      </div>
    </div>
  )
}

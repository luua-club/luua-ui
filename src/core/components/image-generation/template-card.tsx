import { ImageTemplate } from '@/core/models/image-generation.model'
import { cn } from '@/shared/utils'

interface TemplateCardProps {
  template: ImageTemplate
  selected: boolean
  onClick: () => void
}

function TemplateCard({ template, selected, onClick }: TemplateCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col gap-1.5 rounded-lg border p-3 text-left transition-colors',
        'hover:bg-accent/50',
        selected
          ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
          : 'border-border'
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{template.name}</span>
        <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">
          {template.category}
        </span>
      </div>
      <p className="text-muted-foreground text-xs leading-relaxed">
        {template.description}
      </p>
    </button>
  )
}

export default TemplateCard

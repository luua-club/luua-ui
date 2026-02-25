import type { ReactNode } from 'react'

interface PostPlatformLabelProps {
  icon: ReactNode
  label: string
}

export function PostPlatformLabel({ icon, label }: PostPlatformLabelProps) {
  return (
    <div className="bg-card mx-auto mb-2 inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-xs font-medium">
      {icon}
      <span>
        {label} - <i>Preview</i>
      </span>
    </div>
  )
}

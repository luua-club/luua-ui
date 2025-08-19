import { FileText, X } from 'lucide-react'
import { useMemo } from 'react'

import { Button } from '@/shared/ui/button'

//TODO: IT WILL BE A EXTERNAL LINK
const PostAttachmentPreview = ({
  attachedFiles,
  onRemove,
}: {
  attachedFiles: File[]
  onRemove?: (index: number) => void
}) => {
  const pdfFiles = useMemo(
    () =>
      attachedFiles.filter(
        f =>
          f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
      ),
    [attachedFiles]
  )

  if (pdfFiles.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-2 p-2">
      {pdfFiles.map((file, idx) => (
        <div
          key={idx}
          className="flex items-center gap-2 rounded-md border px-3 py-2"
        >
          <FileText className="size-4 shrink-0 text-gray-500" />
          <span className="truncate text-sm font-medium" title={file.name}>
            {file.name}
          </span>
          {onRemove && (
            <Button
              variant="outline"
              size="icon"
              aria-label="Remove attachment"
              onClick={e => {
                e.stopPropagation()
                onRemove(idx)
              }}
              className="ml-auto size-8"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}

export default PostAttachmentPreview

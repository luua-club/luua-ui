import { X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/shared/ui/button'

const PostImagePreview = ({
  imagePreviews,
  onRemove,
}: {
  imagePreviews: string[]
  onRemove?: (index: number) => void
}) => {
  const [singleAspectRatio, setSingleAspectRatio] = useState(1)
  const minRatio = 4 / 5
  const maxRatio = 191 / 100
  if (imagePreviews.length === 0) return null

  const count = Math.min(imagePreviews.length, 4)

  if (count === 1) {
    return (
      <div
        className="group bg-muted relative overflow-hidden"
        style={{ aspectRatio: singleAspectRatio }}
      >
        <img
          src={imagePreviews[0]}
          alt="attachment-0"
          className="h-full w-full object-cover"
          onLoad={e => {
            const { naturalWidth, naturalHeight } = e.currentTarget
            if (!naturalWidth || !naturalHeight) return
            const ratio = naturalWidth / naturalHeight
            const clamped = Math.min(Math.max(ratio, minRatio), maxRatio)
            if (Math.abs(clamped - singleAspectRatio) > 0.01) {
              setSingleAspectRatio(clamped)
            }
          }}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <RemoveButton index={0} onRemove={onRemove} />
      </div>
    )
  }

  if (count === 2) {
    return (
      <div className="grid grid-cols-2">
        {imagePreviews.slice(0, 2).map((src, idx) => (
          <div key={idx} className="group bg-muted relative overflow-hidden">
            <img
              src={src}
              alt={`attachment-${idx}`}
              className="aspect-square h-full w-full object-cover"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <RemoveButton index={idx} onRemove={onRemove} />
          </div>
        ))}
      </div>
    )
  }

  if (count === 3) {
    return (
      <div className="grid grid-cols-2 grid-rows-2">
        <div className="group bg-muted relative col-span-1 row-span-2 overflow-hidden">
          <img
            src={imagePreviews[0]}
            alt={`attachment-0`}
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <RemoveButton index={0} onRemove={onRemove} />
        </div>
        {imagePreviews.slice(1, 3).map((src, idx) => (
          <div
            key={idx + 1}
            className="group bg-muted relative overflow-hidden"
          >
            <img
              src={src}
              alt={`attachment-${idx + 1}`}
              className="aspect-square h-full w-full object-cover"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <RemoveButton index={idx + 1} onRemove={onRemove} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2">
      {imagePreviews.slice(0, 4).map((src, idx) => {
        const isLast = idx === 3
        const showOverlay = isLast && imagePreviews.length > 4
        return (
          <div key={idx} className="group bg-muted relative overflow-hidden">
            <img
              src={src}
              alt={`attachment-${idx}`}
              className="aspect-square h-full w-full object-cover"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <RemoveButton index={idx} onRemove={onRemove} />
            {showOverlay && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                <span className="text-lg font-semibold">
                  +{imagePreviews.length - 3}
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

const RemoveButton = ({
  index,
  onRemove,
}: {
  index: number
  onRemove?: (index: number) => void
}) => {
  if (!onRemove) return null
  return (
    <Button
      size="icon"
      aria-label="Remove image"
      onClick={e => {
        e.stopPropagation()
        onRemove(index)
      }}
      className="absolute top-2 right-2 z-20 size-8 transition-opacity md:opacity-0 md:group-hover:opacity-100"
    >
      <X className="size-4" />
    </Button>
  )
}

export default PostImagePreview

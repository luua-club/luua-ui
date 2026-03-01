import { useEffect, useState } from 'react'

import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'

interface RenameDraftPopoverProps {
  initialName: string
  onSave: (name: string) => void
  isSaving?: boolean
  children: React.ReactNode
}

function RenameDraftPopover({
  initialName,
  onSave,
  isSaving = false,
  children,
}: RenameDraftPopoverProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(initialName)

  useEffect(() => {
    if (open) {
      setName(initialName)
    }
  }, [open, initialName])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-64 p-3"
        onPointerDown={e => e.stopPropagation()}
        onMouseDown={e => e.stopPropagation()}
        onClick={e => e.stopPropagation()}
      >
        <div className="space-y-2">
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Draft name"
            maxLength={120}
            className="h-8"
          />
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={isSaving}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={isSaving}
              onClick={() => {
                onSave(name.trim() || 'Untitled')
                setOpen(false)
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default RenameDraftPopover

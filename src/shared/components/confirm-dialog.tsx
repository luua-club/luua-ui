import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'

export type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  // Called when the confirm action is clicked. Caller is responsible for closing if desired
  onConfirm: () => void
  // Optional: disable confirm button while processing
  confirmDisabled?: boolean
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  confirmDisabled = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card w-full max-w-sm p-6">
        {/* --- Dialog Header --- */}
        <DialogHeader>
          <DialogTitle className="text-card-foreground text-lg font-semibold">
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* --- Dialog Description --- */}
        {description ? (
          <p className="text-card-foreground mt-2 text-sm">{description}</p>
        ) : null}
        {/* --- Dialog Actions --- */}

        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            className="text-card-foreground flex-1"
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={onConfirm}
            disabled={confirmDisabled}
          >
            {confirmLabel}
          </Button>
        </div>
        <DialogClose className="text-card-foreground" />
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmDialog

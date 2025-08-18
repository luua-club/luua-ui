import { Paperclip, SmilePlus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import ConfirmDialog from '@/shared/components/confirm-dialog'
import EmojiPopover from '@/shared/components/emoji-popover'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'

import StyleFileCapture from '../StyleFileCapture'

interface IPostActionsProps {
  maxFiles?: number
  attachedFiles: File[]
  onFilesChange: (files: File[]) => void
  onEmojiSelect: (emoji: string) => void
  onDelete: () => void
}

//TODO: REFACTOR THIS, FILE UPLOAD WILL HAPPEN TO SERVER
const PostActions = ({
  maxFiles = 4,
  attachedFiles,
  onFilesChange,
  onEmojiSelect,
  onDelete,
}: IPostActionsProps) => {
  const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <div className="flex gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="inline-flex size-7">
          <Button asChild variant="outline">
            <span className="inline-flex h-full w-full items-center justify-center">
              <Paperclip className="size-3" />
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="p-6">
          <DialogClose />
          <DialogHeader className="mb-4">
            <DialogTitle>Upload files</DialogTitle>
            <DialogDescription>
              Drag and drop images or PDFs, or choose files to upload.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-2">
            <StyleFileCapture
              accept="image/*,application/pdf"
              maxFiles={maxFiles}
              maxSize={4 * 1024 * 1024}
              multiple
              hideSubmit
              onFilesChange={files => {
                onFilesChange(files)
                setOpen(false)
              }}
              value={attachedFiles}
              description={
                <span className="text-xs">
                  Upload up to {maxFiles} images or PDFs, max 4MB each.
                </span>
              }
            />
          </div>
        </DialogContent>
      </Dialog>

      <EmojiPopover onEmojiSelect={emoji => onEmojiSelect(emoji)}>
        <Button variant="outline" className="size-7">
          <SmilePlus className="size-3" />
        </Button>
      </EmojiPopover>

      <Button
        variant="destructive"
        className="size-7"
        aria-label="Delete post"
        onClick={() => setConfirmOpen(true)}
      >
        <Trash2 className="size-3" />
      </Button>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={open => (open ? undefined : setConfirmOpen(false))}
        title="Are you sure ?"
        description={
          'This action cannot be undone. This will permanently delete the selected post.'
        }
        confirmLabel="Delete"
        onConfirm={() => {
          onDelete()
          setConfirmOpen(false)
        }}
      />
    </div>
  )
}

export default PostActions

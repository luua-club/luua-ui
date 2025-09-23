import { Paperclip, SmilePlus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { ComingSoonBtn } from '@/shared/components/coming-soon-btn'
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

interface IPostActionsProps {
  onEmojiSelect: (emoji: string) => void
  onDelete: () => void
}

//TODO: REFACTOR THIS, FILE UPLOAD WILL HAPPEN TO SERVER
const PostActions = ({ onEmojiSelect, onDelete }: IPostActionsProps) => {
  const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <div className="flex gap-2 lg:flex-col">
      <Button
        variant="destructive"
        className="size-7"
        aria-label="Delete post"
        onClick={() => setConfirmOpen(true)}
      >
        <Trash2 className="size-3" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="inline-flex size-7">
          <Button asChild variant="outline">
            <span className="inline-flex h-full w-full items-center justify-center">
              <Paperclip className="size-3" />
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card text-card-foreground w-full p-6 md:w-fit">
          <DialogClose />
          <DialogHeader className="mb-4">
            <DialogTitle>Upload files</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Drag and drop images or PDFs, or choose files to upload.
            </DialogDescription>
          </DialogHeader>
          <div className="flex pt-2">
            <ComingSoonBtn />
          </div>
        </DialogContent>
      </Dialog>

      <EmojiPopover onEmojiSelect={emoji => onEmojiSelect(emoji)}>
        <Button variant="outline" className="size-7">
          <SmilePlus className="size-3" />
        </Button>
      </EmojiPopover>

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

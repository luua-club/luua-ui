import { Paperclip, SmilePlus } from 'lucide-react'
import { useState } from 'react'

import { ComingSoonBtn } from '@/shared/components/coming-soon-btn'
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

interface IPostCardActionsProps {
  onEmojiSelect: (emoji: string) => void
}

//TODO: REFACTOR THIS, FILE UPLOAD WILL HAPPEN TO SERVER
function PostCardActions({ onEmojiSelect }: IPostCardActionsProps) {
  // --- State ---
  const [open, setOpen] = useState(false)

  return (
    <div className="flex gap-2 lg:flex-col">
      {/* Upload Dialog */}
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

      {/* Emoji Popover */}
      <EmojiPopover onEmojiSelect={emoji => onEmojiSelect(emoji)}>
        <Button variant="outline" className="size-7">
          <SmilePlus className="size-3" />
        </Button>
      </EmojiPopover>
    </div>
  )
}

export default PostCardActions

import * as React from 'react'

import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from '@/shared/ui/emoji-picker'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'

interface EmojiPopoverProps {
  children: React.ReactNode
  onEmojiSelect: (emoji: string) => void
}

export default function EmojiPopover({
  children,
  onEmojiSelect,
}: EmojiPopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <EmojiPicker
          className="h-[342px]"
          onEmojiSelect={({ emoji }) => {
            setIsOpen(false)
            onEmojiSelect(emoji)
          }}
        >
          <EmojiPickerSearch />
          <EmojiPickerContent />
          <EmojiPickerFooter />
        </EmojiPicker>
      </PopoverContent>
    </Popover>
  )
}

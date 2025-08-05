import { useEffect, useState } from 'react'

import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { cn } from '@/shared/utils'

import { IPost } from '../models/post.model'
import Post from './Post'

interface ISharePostModalProps {
  isOpen: boolean
  posts: Pick<IPost, 'id' | 'content' | 'channel'>[]
  onOpenChange: (open: boolean) => void
  onSubmit: (postIds: string[]) => void
}

export function SharePostModal({
  isOpen,
  posts,
  onOpenChange,
  onSubmit,
}: ISharePostModalProps) {
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])

  useEffect(() => {
    setSelectedPosts(posts.map(post => post.id))
  }, [posts])

  const handleCheckboxChange = (postId: string, checked: string | boolean) => {
    const isChecked = checked === true || checked === 'true'
    if (isChecked) {
      setSelectedPosts([...selectedPosts, postId])
    } else {
      setSelectedPosts(selectedPosts.filter(id => id !== postId))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-sm bg-white p-6 md:max-w-xl dark:bg-zinc-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-zinc-900 md:text-2xl dark:text-white">
            Final Review
            <span className="mt-2 pl-2 text-xs text-zinc-400 md:mt-0 dark:text-zinc-600">
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {posts.map(post => (
            <div
              key={post.id}
              className={cn(
                'relative cursor-pointer rounded-lg border-2 border-transparent',
                selectedPosts.includes(post.id) && 'border-black'
              )}
              onClick={() =>
                handleCheckboxChange(post.id, !selectedPosts.includes(post.id))
              }
            >
              <Checkbox
                className="absolute top-[-10px] right-[-8px] z-10 size-5 cursor-pointer bg-white"
                checked={selectedPosts.includes(post.id)}
                onCheckedChange={checked => {
                  handleCheckboxChange(post.id, checked)
                }}
                onClick={e => e.stopPropagation()}
              />
              <Post
                id={post.id}
                channel={post.channel}
                content={post.content}
                tileView
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            className="flex-1"
            onClick={() => onSubmit(selectedPosts)}
            disabled={selectedPosts.length === 0}
          >
            {selectedPosts.length
              ? `Publish (${selectedPosts.length})`
              : 'Choose posts'}
          </Button>
        </div>
        <DialogClose />
      </DialogContent>
    </Dialog>
  )
}

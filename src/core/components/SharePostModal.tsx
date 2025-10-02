import { Calendar, Loader2, Send } from 'lucide-react'
import { useEffect, useState } from 'react'

import { SchedulePicker } from '@/shared/components/schedule-picker'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Label } from '@/shared/ui/label'
import { cn } from '@/shared/utils'

import { useUserState } from '../hooks/user-state.hook'
import { IPost } from '../models/post.model'
import Post from './Post'

export type ShareModalOpenState = {
  open: boolean
  schedule: boolean
}

export type SharePostType = Pick<IPost, 'id' | 'content' | 'channel'>[]

interface ISharePostModalProps {
  isOpen: ShareModalOpenState
  posts: SharePostType
  isLoading: boolean
  onOpenChange: (state: ShareModalOpenState) => void
  onSubmit: (
    postIds: string[],
    schedule: boolean,
    scheduleDate?: string
  ) => void
}

export function SharePostModal({
  isOpen,
  posts,
  isLoading,
  onOpenChange,
  onSubmit,
}: ISharePostModalProps) {
  const user = useUserState()
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [showSchedule, setShowSchedule] = useState(false)

  // A channel's post can only be selected if that social is connected for the user
  const connections = user?.connected_channels
  const isChannelConnected = (channel: IPost['channel']) => {
    const key = channel.toLowerCase() as 'linkedin' | 'twitter'
    return Boolean(connections?.[key]?.connected)
  }
  // Initialize selection only when the modal opens. Do not overwrite user
  // choices while the modal remains open.
  useEffect(() => {
    if (!isOpen.open) return

    setSelectedPosts(prev => {
      if (prev.length > 0) return prev
      const nextSelected = posts
        .filter(p => isChannelConnected(p.channel))
        .map(p => p.id)
      return nextSelected
    })
    // Intentionally not depending on `posts` to avoid resetting user selection
    // due to parent re-renders while the dialog stays open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen.open])

  const togglePost = (postId: string, checked: string | boolean) => {
    const isChecked = checked === true || checked === 'true'
    setSelectedPosts(prev =>
      isChecked
        ? Array.from(new Set([...prev, postId]))
        : prev.filter(id => id !== postId)
    )
  }

  const visiblePosts = posts.filter(post => isChannelConnected(post.channel))

  // Inner: Schedule picker content (uses closures, no props needed)
  const ScheduleModalContent = ({
    onDone,
    isLoading,
  }: {
    onDone: (utcIso: string) => void
    isLoading: boolean
  }) => {
    return (
      <div className="mt-4">
        <SchedulePicker
          isLoading={isLoading}
          onSubmit={data => {
            const [h, m] = data.time.split(':').map(Number)
            const merged = new Date(data.date)
            merged.setHours(h, m, 0, 0)
            const utc = merged.toISOString()
            onDone(utc)
          }}
        />
      </div>
    )
  }

  // Inner: Posts grid + actions
  const PostModalContent = () => {
    return (
      <>
        <div
          className={cn(
            'mt-6 grid grid-cols-1 gap-4',
            visiblePosts.length === 2 && 'lg:grid-cols-2'
          )}
        >
          {visiblePosts.map(post => (
            <div key={post.id}>
              <div className="mb-2 flex items-center gap-2">
                <Checkbox
                  className="size-4 cursor-pointer"
                  checked={selectedPosts.includes(post.id)}
                  onCheckedChange={checked => {
                    togglePost(post.id, checked)
                  }}
                  onClick={e => e.stopPropagation()}
                />
                <Label
                  htmlFor="terms"
                  className="text-muted-foreground text-sm font-semibold"
                >
                  SELECT {post.channel.toUpperCase()}
                </Label>
              </div>

              <Post
                id={post.id}
                channel={post.channel}
                content={post.content}
                maintainFormatting
              />
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-between gap-4">
          <Button
            variant="outline"
            className="text-card-foreground"
            onClick={() => {
              onOpenChange({ ...isOpen, open: false })
            }}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={() => {
              if (isOpen.schedule) {
                setShowSchedule(true)
              } else {
                onSubmit(selectedPosts, false)
              }
            }}
            disabled={selectedPosts.length === 0 || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 animate-spin" />}
            {selectedPosts.length
              ? `${isOpen.schedule ? 'Schedule' : 'Publish'} (${selectedPosts.length})`
              : 'Choose posts'}
          </Button>
        </div>
      </>
    )
  }

  return (
    <Dialog
      open={isOpen.open}
      onOpenChange={open => {
        onOpenChange({ ...isOpen, open })
        setShowSchedule(false)
        // Clear selection on close so that next open can re-initialize
        if (!open) {
          setSelectedPosts([])
        }
      }}
    >
      <DialogContent
        className={cn(
          'bg-card w-full p-6 lg:max-w-4xl',
          visiblePosts.length < 2 && 'lg:max-w-xl',
          showSchedule && '!max-w-fit'
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-card-foreground mb-4 text-center text-xl font-semibold">
            {isOpen.schedule ? (
              <span className="flex w-full items-center justify-center gap-2">
                <Calendar className="size-5" />
                Schedule Posts
              </span>
            ) : (
              <span className="flex w-full items-center justify-center gap-2">
                <Send className="size-5" />
                Publish Posts
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <DialogDescription>
          <BestTimeTip />
        </DialogDescription>

        {showSchedule ? (
          <ScheduleModalContent
            isLoading={isLoading}
            onDone={utc => {
              onSubmit(selectedPosts, true, utc)
            }}
          />
        ) : (
          <PostModalContent />
        )}
        <DialogClose className="text-card-foreground" />
      </DialogContent>
    </Dialog>
  )
}

const BestTimeTip = () => {
  return (
    <div className="border-brand-border-info bg-brand-background-info text-brand-text-info rounded-sm border p-4 text-xs">
      <p>
        <strong>Tip:</strong> Catch your audience when they&apos;re most active
        for the best reach.
      </p>

      <ul className="mt-2 flex list-disc flex-col gap-2 pl-4">
        <li>
          <strong>Mon-Fri:</strong> Early mornings (8-10 a.m.) and lunchtime are
          your sweet spots.
        </li>
        <li>
          <strong>Wed & Thu:</strong> Extra boost around 9 a.m. with mornings
          (8-10 a.m.) staying strong.
        </li>
        <li>
          <strong>Fri-Sun:</strong> Mornings (8-9 a.m.) work best, with Sunday
          noon as a bonus.
        </li>
      </ul>
    </div>
  )
}

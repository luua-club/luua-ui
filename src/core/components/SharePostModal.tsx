import {
  ArrowDownToDot,
  ChevronRight,
  Loader2,
  OctagonPause,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { SchedulePicker } from '@/shared/components/schedule-picker'
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

  useEffect(() => {
    // Preselect only the posts for channels that are connected
    const nextSelected = posts
      .filter(p => isChannelConnected(p.channel))
      .map(p => p.id)

    // Avoid unnecessary state updates to prevent re-render loops
    setSelectedPosts(prev => {
      if (
        prev.length === nextSelected.length &&
        prev.every((id, i) => id === nextSelected[i])
      ) {
        return prev
      }
      return nextSelected
    })
    // Only depend on primitive connection flags to avoid changing on every render
  }, [posts, connections?.linkedin?.connected, connections?.twitter?.connected])

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
            'mt-4 grid grid-cols-1 gap-4',
            visiblePosts.length === 2 && 'md:grid-cols-2'
          )}
        >
          {visiblePosts.map(post => (
            <div
              key={post.id}
              className={cn(
                'relative rounded-lg border-1 border-transparent',
                selectedPosts.includes(post.id) &&
                  'dark:border-card-foreground border-black',
                'cursor-pointer'
              )}
              onClick={() => {
                togglePost(post.id, !selectedPosts.includes(post.id))
              }}
            >
              <Checkbox
                className="absolute top-[-10px] right-[-8px] z-10 size-5 cursor-pointer rounded-full bg-white dark:bg-black"
                checked={selectedPosts.includes(post.id)}
                onCheckedChange={checked => {
                  togglePost(post.id, checked)
                }}
                onClick={e => e.stopPropagation()}
              />
              <Post
                id={post.id}
                channel={post.channel}
                content={post.content}
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
      }}
    >
      <DialogContent
        className={cn(
          'bg-card w-full max-w-sm p-6 md:max-w-xl',
          showSchedule && '!max-w-fit'
        )}
      >
        <DialogHeader>
          <DialogTitle className="mb-4 flex flex-col gap-2 text-xl font-semibold text-zinc-800 md:text-2xl dark:text-zinc-300">
            Almost There
            <span className="flex justify-between text-sm">
              <span className="flex items-center gap-1">
                Give your post a quick review
                <ChevronRight className="size-4" />
              </span>
              <span>
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </span>
          </DialogTitle>
        </DialogHeader>

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

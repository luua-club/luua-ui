import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/shared/ui/carousel'
import { Skeleton } from '@/shared/ui/skeleton'
import { cn } from '@/shared/utils'

import { SOCIAL_PLATFORM } from '../config/constant'
import { useUserState } from '../hooks/user-state.hook'
import { IPost } from '../models/post.model'
import { ProjectSocial } from '../models/social.model'
import { extractUserInitial } from '../utils/common.util'
import ThumbnailImage from './ThumbnailImage'

type PostProps = IPost & {
  isLoading?: boolean
  tileView?: boolean
  maintainFormatting?: boolean
  noBorder?: boolean
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function usePostUser(channel?: string) {
  const userState = useUserState()
  const connectedChannels = userState?.connectedChannels
  const platform = SOCIAL_PLATFORM.find(s => s.name === channel)

  const channelUser: ProjectSocial | undefined =
    platform?.name === 'LinkedIn'
      ? connectedChannels?.linkedin
      : platform?.name === 'Instagram'
        ? connectedChannels?.instagram
        : connectedChannels?.twitter

  let user = {
    name: userState?.name ?? '',
    username: userState?.email ?? '',
    image: userState?.profile_image ?? '',
  }

  if (channelUser) {
    user = {
      name: channelUser.user_name || user.name,
      username: channelUser.user_id
        ? platform?.name === 'Twitter'
          ? `@${channelUser.user_id}`
          : channelUser.user_email
        : user.username,
      image: channelUser.user_profile_picture ?? user.image,
    }
  }

  return { userState, platform, user }
}

// ---------------------------------------------------------------------------
// Instagram Post layout
// ---------------------------------------------------------------------------

function InstagramPost({
  content,
  attached_media,
  tileView = false,
  maintainFormatting = false,
  noBorder = false,
}: PostProps) {
  const [expanded, setExpanded] = useState(false)
  const { userState, platform, user } = usePostUser('Instagram')

  if (!userState) return <PostSkeleton tileView={tileView} />

  const MAX_CHARS = 150
  const raw = content || ''
  const isLong = raw.length > MAX_CHARS
  const displayText =
    expanded || !isLong ? content : content.slice(0, MAX_CHARS).trimEnd() + '…'

  const hasImages = attached_media && attached_media.length > 0

  return (
    <Card
      className={cn(
        'bg-card relative flex flex-col overflow-hidden rounded-md p-0 shadow-none',
        tileView ? 'min-h-auto' : 'h-fit',
        noBorder && 'border-none'
      )}
    >
      <CardContent className="flex flex-1 flex-col border-none p-0">
        {/* ── Header (same as LinkedIn / Twitter) ── */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3">
          <Avatar
            className={cn(
              'shrink-0 rounded-full',
              tileView ? 'h-10 w-10' : 'h-12 w-12'
            )}
          >
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>{extractUserInitial(user.name)}</AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-col">
            <div className="flex min-w-0 items-center gap-2 text-sm font-medium sm:text-base">
              <h6 className="truncate">{user.name}</h6>
            </div>
            <p className="truncate text-xs font-medium text-zinc-400">
              {user.username}
            </p>
          </div>

          {platform && platform.logo && (
            <div className="dark:bg-card rounded-full border-1 border-dashed p-3">
              <platform.logo className="size-5" />
            </div>
          )}
        </div>

        {/* ── Separator ── */}
        {!tileView && <hr />}

        {/* ── Image carousel ── */}
        {hasImages && (
          <InstagramPostCarousel
            images={attached_media.map(m => m.thumbnail || m.url)}
          />
        )}

        {/* ── Caption ── */}
        {raw.length > 0 && (
          <div className="p-4 pt-3">
            {maintainFormatting ? (
              <>
                <p className="text-sm leading-relaxed">
                  <span className="mr-1.5 font-semibold">{user.name}</span>
                  <span className="break-words whitespace-pre-wrap">
                    {displayText}
                  </span>
                </p>
                {isLong && (
                  <Button
                    variant="link"
                    className="!p-0 text-xs text-blue-600 dark:text-blue-300"
                    onClick={() => setExpanded(prev => !prev)}
                  >
                    {expanded ? 'See less' : 'See more'}
                  </Button>
                )}
              </>
            ) : (
              <p
                className={cn(
                  'text-card-foreground text-sm',
                  tileView && 'line-clamp-2'
                )}
              >
                <span className="mr-1.5 font-semibold">{user.name}</span>
                {content}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Instagram image carousel (used inside InstagramPost)
// ---------------------------------------------------------------------------

function InstagramPostCarousel({ images }: { images: string[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  useEffect(() => {
    if (!api) return
    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap())
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }
    onSelect()
    api.on('select', onSelect)
    api.on('reInit', onSelect)
    return () => {
      api.off('select', onSelect)
      api.off('reInit', onSelect)
    }
  }, [api])

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api])
  const scrollNext = useCallback(() => api?.scrollNext(), [api])

  if (images.length === 0) return null

  // Single image — blurred bg + sharp overlay, no carousel
  if (images.length === 1) {
    return (
      <div className="bg-muted/30 relative h-48 w-full overflow-hidden">
        <img
          src={images[0]}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-xl"
        />
        <img
          src={images[0]}
          alt="Post media"
          className="relative z-10 mx-auto h-full object-contain"
        />
      </div>
    )
  }

  return (
    <div className="relative">
      <Carousel setApi={setApi} opts={{ align: 'start', loop: false }}>
        <CarouselContent className="ml-0">
          {images.map((src, idx) => (
            <CarouselItem key={idx} className="pl-0">
              <div className="bg-muted/30 relative h-48 w-full overflow-hidden">
                <img
                  src={src}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-xl"
                />
                <img
                  src={src}
                  alt={`Post media ${idx + 1}`}
                  className="relative z-10 mx-auto h-full object-contain"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Left arrow */}
      {canScrollPrev && (
        <button
          type="button"
          onClick={scrollPrev}
          className="absolute top-1/2 left-2 z-20 flex size-6 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white dark:bg-black/70 dark:hover:bg-black/90"
        >
          <ChevronLeft className="size-3.5 text-black dark:text-white" />
        </button>
      )}

      {/* Right arrow */}
      {canScrollNext && (
        <button
          type="button"
          onClick={scrollNext}
          className="absolute top-1/2 right-2 z-20 flex size-6 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white dark:bg-black/70 dark:hover:bg-black/90"
        >
          <ChevronRight className="size-3.5 text-black dark:text-white" />
        </button>
      )}

      {/* Counter badge */}
      <span className="absolute top-2 right-2 z-20 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
        {currentIndex + 1}/{images.length}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Default (LinkedIn / Twitter) Post layout
// ---------------------------------------------------------------------------

function DefaultPost({
  channel,
  content,
  attached_media,
  tileView = false,
  maintainFormatting = false,
  noBorder = false,
}: PostProps) {
  const [expanded, setExpanded] = useState(false)
  const { userState, platform, user } = usePostUser(channel)

  if (!userState) return <PostSkeleton tileView={tileView} />

  const MAX_CHARS = 300
  const raw = content || ''
  const isLong = raw.length > MAX_CHARS
  const displayText =
    expanded || !isLong
      ? content
      : content.slice(0, MAX_CHARS).trimEnd() + '...'

  return (
    <Card
      className={cn(
        'bg-card relative flex flex-col rounded-md p-0 shadow-none',
        tileView ? 'min-h-auto' : 'h-fit',
        noBorder && 'border-none'
      )}
    >
      <CardContent className="flex flex-1 flex-col border-none p-0">
        {/** USER INFO */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3">
          {/** AVATAR */}
          <Avatar
            className={cn(
              'shrink-0 rounded-full',
              tileView ? 'h-10 w-10' : 'h-12 w-12'
            )}
          >
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>{extractUserInitial(user.name)}</AvatarFallback>
          </Avatar>

          {/** USER INFO */}
          <div className="flex min-w-0 flex-col">
            <div className="flex min-w-0 items-center gap-2 text-sm font-medium sm:text-base">
              <h6 className="truncate">{user.name}</h6>
            </div>
            <p className="truncate text-xs font-medium text-zinc-400">
              {user.username}
            </p>
          </div>

          {/** SOCIAL LOGO */}
          {platform && platform.logo && (
            <div className="dark:bg-card rounded-full border-1 border-dashed p-3">
              <platform.logo className="size-5" />
            </div>
          )}
        </div>

        {/** SEPARATOR */}
        {!tileView && <hr />}

        {/** CONTENT */}
        {(displayText.length > 0 || content.length > 0) &&
          (maintainFormatting ? (
            <div className="p-4 pt-3 text-sm">
              <p className="break-words whitespace-pre-wrap">{displayText}</p>
              {isLong && (
                <Button
                  variant="link"
                  className="!p-0 text-xs text-blue-600 dark:text-blue-300"
                  onClick={() => setExpanded(prev => !prev)}
                >
                  {expanded ? 'See less' : 'See more'}
                </Button>
              )}
            </div>
          ) : (
            <p
              className={cn(
                'text-card-foreground my-4 px-4 text-sm',
                tileView ? 'mt-0 line-clamp-3' : undefined
              )}
            >
              {content}
            </p>
          ))}

        {attached_media && attached_media.length > 0 && (
          <div
            className={cn(
              'flex flex-col gap-2 p-4',
              content.length > 0 && 'pt-0'
            )}
          >
            <p className="text-xs font-bold">
              Attachments ({attached_media.length})
            </p>
            <div className="flex gap-2 overflow-x-auto">
              {attached_media.map((image, index) => (
                <ThumbnailImage
                  key={index}
                  src={image.thumbnail || image.url}
                  alt={`attachment-${index}`}
                  className="h-12 w-12 flex-shrink-0"
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Router component — picks the right layout per platform
// ---------------------------------------------------------------------------

function Post(props: PostProps) {
  const { isLoading = false, tileView } = props

  const userState = useUserState()

  if (!userState || isLoading) {
    return <PostSkeleton tileView={tileView} />
  }

  if (props.channel === 'Instagram') {
    return <InstagramPost {...props} />
  }

  return <DefaultPost {...props} />
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

export const PostSkeleton = ({
  tileView = false,
  noBorder = false,
}: {
  tileView?: boolean
  noBorder?: boolean
}) => {
  return (
    <Card
      className={cn(
        'relative flex min-h-52 flex-col overflow-hidden rounded-md p-0 shadow-none',
        tileView ? 'min-h-36' : 'h-fit',
        noBorder && 'border-none'
      )}
    >
      <CardContent className="flex flex-1 flex-col p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex flex-col pl-2">
              <Skeleton className="mb-1 h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        {!tileView && <hr />}
        <div className="mt-3 space-y-2 px-4">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </CardContent>
    </Card>
  )
}

export default Post

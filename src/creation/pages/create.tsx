import { createLazyRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { type ReactElement, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import InstagramPostCard from '@/core/components/post-card/instagram-post-card'
import LinkedInPostCard from '@/core/components/post-card/linkedin-post-card'
import { PostCardMode } from '@/core/components/post-card/post-card.types'
import TwitterPostCard from '@/core/components/post-card/twitter-post-card'
import { SOCIAL_PLATFORM } from '@/core/config/constant'
import type { channelType } from '@/core/models/social.model'
import { FloatingChat } from '@/creation/components/floating-chat'
import { DraftLockedBanner } from '@/shared/components/draft-locked-banner'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui/carousel'

import CreateHeader from '../components/create-header'
import { CreateHeaderOptions } from '../components/create-header-options'
import { useDraft } from '../hooks/use-draft.hook'

type SocialTab = channelType | 'all'
type PreviewMode = 'editor' | 'preview'
type LayoutMode = 'grid' | 'row'

function formatUpdatedAt(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Unsaved changes'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function Create() {
  const navigate = useNavigate()
  const { source } = useSearch({ from: '/creation/create' })
  // Freeze the initial source so it survives the URL cleanup re-render
  const [initialSource] = useState(source)
  const [activeTab, setActiveTab] = useState<SocialTab>('all')
  const [previewMode, setPreviewMode] = useState<PreviewMode>('editor')
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('grid')
  const [isAiGenerating, setIsAiGenerating] = useState(false)
  const draft = useDraft()
  const allChannels = useMemo(
    () => SOCIAL_PLATFORM.map(platform => platform.name as channelType),
    []
  )

  // Called by FloatingChat right before it submits the auto-prompt.
  // Strips source from the URL at that point (safe — message is already queued).
  const handleAutoSubmitStart = () => {
    navigate({
      to: '/creation/create',
      search: { draftId: draft.draftId ?? undefined },
      replace: true,
    })
  }

  // Force preview mode when draft is read-only (lock not acquired)
  const effectivePreviewMode = draft.isReadOnly ? 'preview' : previewMode
  const cardMode: PostCardMode =
    effectivePreviewMode === 'preview' ? 'preview' : 'editor'

  const enabledChannels =
    draft.enabledChannels.length > 0
      ? draft.enabledChannels
      : draft.draftId
        ? allChannels.slice(0, 1)
        : allChannels

  const handleChannelToggle = draft.setChannelEnabled

  const isLinkedInEnabled = enabledChannels.includes('LinkedIn')
  const isTwitterEnabled = enabledChannels.includes('Twitter')
  const isInstagramEnabled = enabledChannels.includes('Instagram')

  // All socials are always available; tabs only control visibility.
  const showLinkedIn =
    isLinkedInEnabled && (activeTab === 'all' || activeTab === 'LinkedIn')
  const showTwitter =
    isTwitterEnabled && (activeTab === 'all' || activeTab === 'Twitter')
  const showInstagram =
    isInstagramEnabled && (activeTab === 'all' || activeTab === 'Instagram')
  const isAllTab = activeTab === 'all'
  const hasRowToggle = enabledChannels.length > 2
  const effectiveLayoutMode = isAllTab && hasRowToggle ? layoutMode : 'grid'
  const reviewActionsDisabled =
    !draft.hasContent ||
    draft.saveStatus === 'pending' ||
    !draft.draftId ||
    draft.hasExceededCharLimit ||
    draft.isReadOnly

  const saveStatusLabel = draft.draftId
    ? draft.updatedAt
      ? `Updated ${formatUpdatedAt(draft.updatedAt)}`
      : 'Updated recently'
    : 'Unsaved changes'
  const scheduleUsageLabel = undefined

  useEffect(() => {
    if (activeTab === 'all') return
    if (enabledChannels.includes(activeTab)) return
    setActiveTab('all')
  }, [activeTab, enabledChannels])

  useEffect(() => {
    if (hasRowToggle) return
    if (layoutMode === 'grid') return
    setLayoutMode('grid')
  }, [hasRowToggle, layoutMode])

  const openReviewFlow = (schedule: boolean) => {
    if (!draft.hasContent) {
      toast.error('Add some content before continuing')
      return
    }

    if (!draft.draftId) {
      draft.handleSaveDraft()
      toast.info('Saving your draft first. Try again in a second.')
      return
    }

    navigate({
      to: '/review/$draftId',
      params: { draftId: draft.draftId },
      search: schedule ? { schedule: 'true' } : {},
    })
  }

  return (
    <div className="bg-secondary flex h-full min-h-screen flex-col dark:bg-[#0b0d12]">
      <div className="sticky top-0 z-20 shadow">
        <CreateHeader
          title={draft.draftName || 'Untitled'}
          updatedAt={saveStatusLabel}
          canRename={!!draft.draftId}
          onSave={draft.handleSaveDraft}
          saveStatus={draft.saveStatus}
          saveDisabled={
            !draft.hasContent ||
            draft.saveStatus === 'pending' ||
            draft.isReadOnly
          }
          onSchedule={() => openReviewFlow(true)}
          scheduleDisabled={reviewActionsDisabled}
          scheduleUsageLabel={scheduleUsageLabel}
          onPublish={() => openReviewFlow(false)}
          publishDisabled={reviewActionsDisabled}
          onTitleChange={draft.isReadOnly ? undefined : draft.handleRenameDraft}
          isReadOnly={draft.isReadOnly}
        />

        <CreateHeaderOptions
          selected={activeTab}
          onChange={setActiveTab}
          previewMode={effectivePreviewMode}
          onPreviewModeChange={draft.isReadOnly ? undefined : setPreviewMode}
          layoutMode={effectiveLayoutMode}
          onLayoutModeChange={setLayoutMode}
          enabledChannels={enabledChannels}
          onChannelToggle={handleChannelToggle}
          onBackToDashboard={() => navigate({ to: '/dashboard' })}
        />
      </div>

      {draft.lockedByUser && (
        <div className="px-4 pt-4">
          <DraftLockedBanner
            name={draft.lockedByUser.user_name}
            email={draft.lockedByUser.email}
          />
        </div>
      )}

      <div className="flex-1 p-4 pt-6">
        {(() => {
          const cardItems = [
            showLinkedIn
              ? {
                  key: 'linkedin',
                  node: (
                    <div
                      className={
                        isAllTab ? 'w-full' : 'mx-auto w-full max-w-2xl'
                      }
                    >
                      <LinkedInPostCard
                        loading={draft.isLoading}
                        initialContent={draft.postDrafts.LinkedIn?.content}
                        initialImages={
                          draft.postDrafts.LinkedIn?.attached_media
                        }
                        mode={cardMode}
                        isActionLoading={isAiGenerating}
                        shimmer={
                          isAiGenerating &&
                          (activeTab === 'all' || activeTab === 'LinkedIn')
                        }
                        onRequestEdit={
                          draft.isReadOnly
                            ? undefined
                            : () => setPreviewMode('editor')
                        }
                        onContentChange={val =>
                          draft.handleContentChange(val, 'LinkedIn')
                        }
                        onImagesChange={images =>
                          draft.handleImagesChange(images, 'LinkedIn')
                        }
                      />
                    </div>
                  ),
                }
              : null,
            showTwitter
              ? {
                  key: 'twitter',
                  node: (
                    <div
                      className={
                        isAllTab ? 'w-full' : 'mx-auto w-full max-w-2xl'
                      }
                    >
                      <TwitterPostCard
                        loading={draft.isLoading}
                        initialContent={draft.postDrafts.Twitter?.content}
                        initialImages={draft.postDrafts.Twitter?.attached_media}
                        mode={cardMode}
                        isActionLoading={isAiGenerating}
                        shimmer={
                          isAiGenerating &&
                          (activeTab === 'all' || activeTab === 'Twitter')
                        }
                        onRequestEdit={
                          draft.isReadOnly
                            ? undefined
                            : () => setPreviewMode('editor')
                        }
                        onContentChange={val =>
                          draft.handleContentChange(val, 'Twitter')
                        }
                        onImagesChange={images =>
                          draft.handleImagesChange(images, 'Twitter')
                        }
                      />
                    </div>
                  ),
                }
              : null,
            showInstagram
              ? {
                  key: 'instagram',
                  node: (
                    <div
                      className={
                        isAllTab ? 'w-full' : 'mx-auto w-full max-w-[470px]'
                      }
                    >
                      <InstagramPostCard
                        loading={draft.isLoading}
                        initialContent={draft.postDrafts.Instagram?.content}
                        initialImages={
                          draft.postDrafts.Instagram?.attached_media
                        }
                        mode={cardMode}
                        isActionLoading={isAiGenerating}
                        shimmer={
                          isAiGenerating &&
                          (activeTab === 'all' || activeTab === 'Instagram')
                        }
                        onRequestEdit={
                          draft.isReadOnly
                            ? undefined
                            : () => setPreviewMode('editor')
                        }
                        onContentChange={val =>
                          draft.handleContentChange(val, 'Instagram')
                        }
                        onImagesChange={images =>
                          draft.handleImagesChange(images, 'Instagram')
                        }
                      />
                    </div>
                  ),
                }
              : null,
          ].filter(
            (item): item is { key: string; node: ReactElement } => item !== null
          )

          if (isAllTab && effectiveLayoutMode === 'row') {
            return (
              <>
                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:hidden">
                  {cardItems.map(item => (
                    <div key={item.key}>{item.node}</div>
                  ))}
                </div>
                <Carousel
                  opts={{
                    align: 'start',
                    slidesToScroll: 1,
                    breakpoints: {
                      '(min-width: 768px)': { slidesToScroll: 2 },
                    },
                  }}
                  className="mx-auto hidden max-w-6xl lg:block"
                >
                  <CarouselContent className="overflow-visible">
                    {cardItems.map(item => (
                      <CarouselItem
                        key={item.key}
                        className="basis-full md:basis-[45%]"
                      >
                        {item.node}
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="-left-5 h-8 w-8" />
                  <CarouselNext className="-right-5 h-8 w-8" />
                </Carousel>
              </>
            )
          }

          if (isAllTab) {
            return (
              <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 xl:grid-cols-2">
                {cardItems.map(item => (
                  <div key={item.key}>{item.node}</div>
                ))}
              </div>
            )
          }

          return (
            <div className="mx-auto flex w-full max-w-6xl justify-center">
              {cardItems.map(item => (
                <div key={item.key} className="w-full">
                  {item.node}
                </div>
              ))}
            </div>
          )
        })()}
      </div>

      {!draft.isReadOnly && (
        <FloatingChat
          onPostsGenerated={draft.handleContentChange}
          onGeneratingChange={setIsAiGenerating}
          channel={activeTab}
          onChannelChange={setActiveTab}
          enabledChannels={enabledChannels}
          currentState={{
            linkedin: isLinkedInEnabled
              ? (draft.postDrafts.LinkedIn?.content ?? null)
              : null,
            twitter: isTwitterEnabled
              ? (draft.postDrafts.Twitter?.content ?? null)
              : null,
            instagram: isInstagramEnabled
              ? (draft.postDrafts.Instagram?.content ?? null)
              : null,
          }}
          initialOpen={!!initialSource}
          autoSubmitPrompt={initialSource}
          onAutoSubmitStart={handleAutoSubmitStart}
        />
      )}
    </div>
  )
}

export const Route = createLazyRoute('/creation/create')({
  component: Create,
})

export default Create

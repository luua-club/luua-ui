import { createLazyRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'

import BlueskyPostCard from '@/core/components/post-card/bluesky-post-card'
import InstagramPostCard from '@/core/components/post-card/instagram-post-card'
import LinkedInPostCard from '@/core/components/post-card/linkedin-post-card'
import { PostCardMode } from '@/core/components/post-card/post-card.types'
import TwitterPostCard from '@/core/components/post-card/twitter-post-card'
import type { channelType } from '@/core/models/social.model'
import { FloatingChat } from '@/creation/components/floating-chat'
import { DraftLockedBanner } from '@/shared/components/draft-locked-banner'

import CreateHeader from '../components/create-header'
import { CreateHeaderOptions } from '../components/create-header-options'
import { useDraft } from '../hooks/use-draft.hook'

type SocialTab = channelType | 'all'
type PreviewMode = 'editor' | 'preview'

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
  const [isAiGenerating, setIsAiGenerating] = useState(false)
  const draft = useDraft()

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

  // All socials are always available; tabs only control visibility.
  const showLinkedIn = activeTab === 'all' || activeTab === 'LinkedIn'
  const showTwitter = activeTab === 'all' || activeTab === 'Twitter'
  const showInstagram = activeTab === 'all' || activeTab === 'Instagram'
  const showBluesky = activeTab === 'all' || activeTab === 'Bluesky'
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
        <div
          className={
            activeTab === 'all'
              ? 'mx-auto grid max-w-6xl grid-cols-1 gap-6 xl:grid-cols-2'
              : 'mx-auto flex max-w-6xl gap-6'
          }
        >
          {showLinkedIn && (
            <div
              className={
                activeTab === 'all' ? 'w-full' : 'mx-auto w-full max-w-2xl'
              }
            >
              <LinkedInPostCard
                loading={draft.isLoading}
                initialContent={draft.postDrafts.LinkedIn?.content}
                initialImages={draft.postDrafts.LinkedIn?.attached_media}
                mode={cardMode}
                isActionLoading={isAiGenerating}
                shimmer={
                  isAiGenerating &&
                  (activeTab === 'all' || activeTab === 'LinkedIn')
                }
                onRequestEdit={
                  draft.isReadOnly ? undefined : () => setPreviewMode('editor')
                }
                onContentChange={val =>
                  draft.handleContentChange(val, 'LinkedIn')
                }
                onImagesChange={images =>
                  draft.handleImagesChange(images, 'LinkedIn')
                }
              />
            </div>
          )}

          {showTwitter && (
            <div
              className={
                activeTab === 'all' ? 'w-full' : 'mx-auto w-full max-w-2xl'
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
                  draft.isReadOnly ? undefined : () => setPreviewMode('editor')
                }
                onContentChange={val =>
                  draft.handleContentChange(val, 'Twitter')
                }
                onImagesChange={images =>
                  draft.handleImagesChange(images, 'Twitter')
                }
              />
            </div>
          )}

          {showInstagram && (
            <div
              className={
                activeTab === 'all' ? 'w-full' : 'mx-auto w-full max-w-[470px]'
              }
            >
              <InstagramPostCard
                loading={draft.isLoading}
                initialContent={draft.postDrafts.Instagram?.content}
                initialImages={draft.postDrafts.Instagram?.attached_media}
                mode={cardMode}
                isActionLoading={isAiGenerating}
                shimmer={
                  isAiGenerating &&
                  (activeTab === 'all' || activeTab === 'Instagram')
                }
                onRequestEdit={
                  draft.isReadOnly ? undefined : () => setPreviewMode('editor')
                }
                onContentChange={val =>
                  draft.handleContentChange(val, 'Instagram')
                }
                onImagesChange={images =>
                  draft.handleImagesChange(images, 'Instagram')
                }
              />
            </div>
          )}

          {showBluesky && (
            <div
              className={
                activeTab === 'all' ? 'w-full' : 'mx-auto w-full max-w-2xl'
              }
            >
              <BlueskyPostCard
                loading={draft.isLoading}
                initialContent={draft.postDrafts.Bluesky?.content}
                initialImages={draft.postDrafts.Bluesky?.attached_media}
                mode={cardMode}
                isActionLoading={isAiGenerating}
                shimmer={
                  isAiGenerating &&
                  (activeTab === 'all' || activeTab === 'Bluesky')
                }
                onRequestEdit={
                  draft.isReadOnly ? undefined : () => setPreviewMode('editor')
                }
                onContentChange={val =>
                  draft.handleContentChange(val, 'Bluesky')
                }
                onImagesChange={images =>
                  draft.handleImagesChange(images, 'Bluesky')
                }
              />
            </div>
          )}
        </div>
      </div>

      {!draft.isReadOnly && (
        <FloatingChat
          onPostsGenerated={draft.handleContentChange}
          onGeneratingChange={setIsAiGenerating}
          channel={activeTab}
          onChannelChange={setActiveTab}
          currentState={{
            linkedin: draft.postDrafts.LinkedIn?.content ?? null,
            twitter: draft.postDrafts.Twitter?.content ?? null,
            instagram: draft.postDrafts.Instagram?.content ?? null,
            bluesky: draft.postDrafts.Bluesky?.content ?? null,
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

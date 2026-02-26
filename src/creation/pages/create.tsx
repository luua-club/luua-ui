import { createLazyRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'

import LinkedInPostCard from '@/core/components/post-card/linkedin-post-card'
import { PostCardMode } from '@/core/components/post-card/post-card.types'
import TwitterPostCard from '@/core/components/post-card/twitter-post-card'
import type { channelType } from '@/core/models/social.model'
import { FloatingChat } from '@/creation/components/floating-chat'

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

  const cardMode: PostCardMode =
    previewMode === 'preview' ? 'preview' : 'editor'

  // All socials are always available; tabs only control visibility.
  const showLinkedIn = activeTab === 'all' || activeTab === 'LinkedIn'
  const showTwitter = activeTab === 'all' || activeTab === 'Twitter'
  const reviewActionsDisabled =
    !draft.hasContent || draft.saveStatus === 'pending' || !draft.draftId

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
          saveDisabled={!draft.hasContent || draft.saveStatus === 'pending'}
          onSchedule={() => openReviewFlow(true)}
          scheduleDisabled={reviewActionsDisabled}
          onPublish={() => openReviewFlow(false)}
          publishDisabled={reviewActionsDisabled}
          onTitleChange={draft.handleRenameDraft}
        />

        <CreateHeaderOptions
          selected={activeTab}
          onChange={setActiveTab}
          previewMode={previewMode}
          onPreviewModeChange={setPreviewMode}
          onBackToDashboard={() => navigate({ to: '/dashboard' })}
        />
      </div>

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
                onRequestEdit={() => setPreviewMode('editor')}
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
                onRequestEdit={() => setPreviewMode('editor')}
                onContentChange={val =>
                  draft.handleContentChange(val, 'Twitter')
                }
                onImagesChange={images =>
                  draft.handleImagesChange(images, 'Twitter')
                }
              />
            </div>
          )}
        </div>
      </div>

      <FloatingChat
        onPostsGenerated={draft.handleContentChange}
        onGeneratingChange={setIsAiGenerating}
        channel={activeTab}
        onChannelChange={setActiveTab}
        currentState={{
          linkedin: draft.postDrafts.LinkedIn?.content ?? null,
          twitter: draft.postDrafts.Twitter?.content ?? null,
        }}
        initialOpen={!!initialSource}
        autoSubmitPrompt={initialSource}
        onAutoSubmitStart={handleAutoSubmitStart}
      />
    </div>
  )
}

export const Route = createLazyRoute('/creation/create')({
  component: Create,
})

export default Create

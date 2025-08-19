import { createLazyRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { PostSkeleton } from '@/core/components/Post'
import LinkedInPost from '@/core/components/post-preview/LinkedInPost'
import TwitterPost from '@/core/components/post-preview/TwitterPost'
import { FloatingPromptInput } from '@/core/components/PromptInput'
import { SOCIAL_PLATFORM } from '@/core/config/constant'
import { isSocialConnected } from '@/core/config/utils/social.utils'
import { useGeneratePosts } from '@/core/hooks/generate-post.hook'
import { useUserState } from '@/core/hooks/user-state.hook'
import { channelType } from '@/core/models/social.model'
import { Tabs } from '@/shared/ui/tabs'

import CreateDraftTabContent from '../components/CreateDraftTabContent'
import CreateDraftTabList from '../components/CreateDraftTabList'
import DraftActions from '../components/DraftActions'
import { PostDraftsType, useCreateDraft } from '../hooks/create-draft.hook'

const Create = () => {
  // States
  const [selectedSocials, setSelectedSocials] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<string>('')

  // Hooks
  const user = useUserState()
  const {
    postDrafts,
    setPostDrafts,
    draftEnabled,
    draftQuery,
    saveDraftMutation,
    deletePostMutation,
    isSyncing,
    setIsSyncing,
    handleContentChange,
    handleSaveDraft,
    handlePublishDraft,
    isDraftActionsDisabled,
    handleDeletePost,
  } = useCreateDraft()
  const {
    posts: generatedPostContent,
    isLoading: isGenerationLoading,
    isFetching: isGenerationFetching,
    error: generationError,
    setUserPrompt,
  } = useGeneratePosts('')

  // Constants
  const socials = SOCIAL_PLATFORM.map(p => p.name)
  const isGenerationDataFetching = isGenerationLoading || isGenerationFetching

  /**
   * Initialize selected socials from user's connected channels when user loads/changes
   */
  useEffect(() => {
    if (!user) {
      return
    }

    const connected = SOCIAL_PLATFORM.filter(sp => {
      return isSocialConnected(sp.name, user)
    }).map(sp => sp.name)

    const nextSelected = connected.length > 0 ? connected : socials
    setSelectedSocials(prev => (prev.length === 0 ? nextSelected : prev))

    setActiveTab(prev => (prev ? prev : (nextSelected[0] ?? '')))
  }, [user])

  /**
   * Ensure active tab is set appropriately on first load
   */
  useEffect(() => {
    if (!selectedSocials.includes(activeTab)) {
      setActiveTab(selectedSocials[0] ?? '')
    }
  }, [selectedSocials, activeTab])

  /**
   * When syncing is enabled or active tab changes, copy active tab's content
   * to the other post so the active tab acts as source of truth.
   */
  useEffect(() => {
    if (!isSyncing) return
    if (!activeTab) return

    const activeTabContent = postDrafts[activeTab as channelType]?.content ?? ''
    const targetSocials = selectedSocials.filter(n => n !== activeTab)

    const next: PostDraftsType = {
      ...postDrafts,
    }

    let needsUpdate = false

    targetSocials.forEach((target: string) => {
      const social = target as channelType

      const current = postDrafts[social]?.content ?? ''
      if (current !== activeTabContent) {
        next[social] = {
          ...(postDrafts[social] ?? { channel: social }),
          content: activeTabContent,
        }
        needsUpdate = true
      }
    })

    if (needsUpdate) {
      setPostDrafts(next)
    }
  }, [isSyncing, activeTab])

  /**
   * Ran when genAI API error
   */
  useEffect(() => {
    if (generationError) {
      toast.error('Something went wrong')
    }
  }, [generationError])

  /**
   * Ran when genAI creates Posts
   */
  useEffect(() => {
    if (generatedPostContent.length === 0) {
      return
    }

    const post = generatedPostContent.find(p => p.channel === activeTab)
    if (
      post &&
      post.content !== postDrafts[activeTab as channelType]?.content
    ) {
      handleContentChange(post.content, activeTab as channelType)
    }
  }, [generatedPostContent])

  /**
   * It toggles the social in the selected socials list
   * If the social is checked, it adds the social to the list
   * If the social is unchecked, it removes the social from the list
   * If the list has only one social, it does nothing
   *
   * @param name - Social name
   * @param checked - Whether the social is checked
   */
  const toggleSocial = (name: string, checked: boolean) => {
    setSelectedSocials(prev => {
      if (checked) {
        if (prev.includes(name)) return prev
        return [...prev, name]
      }

      if (prev.length <= 1) return prev
      return prev.filter(s => s !== name)
    })
  }

  /**
   * Get post component based on social
   *
   * @param name - Social name
   * @returns Post component
   */
  const getPostComponent = (name: channelType) => {
    switch (name) {
      case 'LinkedIn':
        return (
          <LinkedInPost
            onContentChange={val => handleContentChange(val, name)}
            initialContent={postDrafts[name]?.content}
            loading={
              (draftEnabled && draftQuery.isPending) || isGenerationDataFetching
            }
            isActionLoading={deletePostMutation.isPending}
            handlePostDelete={() => handleDeletePost(postDrafts[name]?.id)}
          />
        )
      case 'Twitter':
        return (
          <TwitterPost
            onContentChange={val => handleContentChange(val, name)}
            initialContent={postDrafts[name]?.content}
            loading={
              (draftEnabled && draftQuery.isPending) || isGenerationDataFetching
            }
            isActionLoading={deletePostMutation.isPending}
            handlePostDelete={() => handleDeletePost(postDrafts[name]?.id)}
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      <div className="relative m-auto max-w-7xl p-2">
        <div className="hidden gap-2 py-1 lg:absolute lg:top-2 lg:right-2 lg:flex">
          <DraftActions
            handleSaveDraft={handleSaveDraft}
            handlePublishDraft={handlePublishDraft}
            isActionDisabled={isDraftActionsDisabled || !user}
            isLoading={saveDraftMutation.isPending}
          />
        </div>
        <Tabs className="w-full" value={activeTab} onValueChange={setActiveTab}>
          {/** Tabs List */}
          <CreateDraftTabList
            selectedSocials={selectedSocials}
            toggleSocial={toggleSocial}
          />

          {selectedSocials.length === 0 && (
            <div className="mx-auto mt-2 w-full md:w-fit md:min-w-2xl">
              <PostSkeleton />
            </div>
          )}

          {/** Tabs Content */}
          {SOCIAL_PLATFORM.filter(social =>
            selectedSocials.includes(social.name)
          ).map(social => (
            <CreateDraftTabContent
              key={social.name}
              tabName={social.name}
              isSyncing={isSyncing}
              onToggleSync={() => setIsSyncing(!isSyncing)}
              getPostComponent={getPostComponent}
            />
          ))}
        </Tabs>
      </div>

      {user && isSocialConnected(activeTab, user) && (
        <FloatingPromptInput
          onChange={prompt => {
            setUserPrompt(prompt)
          }}
          loading={isGenerationDataFetching || saveDraftMutation.isPending}
          expandable
        >
          <div className="flex justify-center gap-2 lg:hidden">
            <DraftActions
              handleSaveDraft={handleSaveDraft}
              handlePublishDraft={handlePublishDraft}
              isActionDisabled={isDraftActionsDisabled || !user}
              isLoading={saveDraftMutation.isPending}
            />
          </div>
        </FloatingPromptInput>
      )}
    </>
  )
}

export const Route = createLazyRoute('/creation/create')({
  component: Create,
})

export default Create

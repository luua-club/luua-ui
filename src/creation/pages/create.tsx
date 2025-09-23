import { createLazyRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import LinkedInPost, {
  LinkedInPostSkeleton,
} from '@/core/components/post-preview/LinkedInPost'
import TwitterPost, {
  TwitterPostSkeleton,
} from '@/core/components/post-preview/TwitterPost'
import { FloatingPromptInput } from '@/core/components/PromptInput'
import { SharePostModal } from '@/core/components/SharePostModal'
import { SOCIAL_PLATFORM } from '@/core/config/constant'
import { useGeneratePosts } from '@/core/hooks/generate-post.hook'
import { useUserState } from '@/core/hooks/user-state.hook'
import { channelType } from '@/core/models/social.model'
import { isSocialConnected } from '@/core/utils/social.utils'
import { Tabs } from '@/shared/ui/tabs'

import CreateDraftTabContent from '../components/CreateDraftTabContent'
import CreateDraftTabList from '../components/CreateDraftTabList'
import DraftActions from '../components/DraftActions'
import { useCreateDraft } from '../hooks/create-draft.hook'

const Create = () => {
  // States
  const [selectedSocials, setSelectedSocials] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<string>('')

  // Hooks
  const user = useUserState()
  const {
    postDrafts,
    draftEnabled,
    draftQuery,
    saveDraftMutation,
    deletePostMutation,
    handleContentChange,
    handleSaveDraft,
    isDraftActionsDisabled,
    handleDeletePost,
    isShareModalOpen,
    setIsShareModalOpen,
    getSharePosts,
    handleSubmitDraft,
  } = useCreateDraft()
  const {
    posts: generatedPostContent,
    isLoading: isGenerationLoading,
    isFetching: isGenerationFetching,
    error: generationError,
    setUserPrompt,
    setUserSearch,
    setUserChannel,
  } = useGeneratePosts('')

  // Constants
  const socials = useMemo(() => SOCIAL_PLATFORM.map(p => p.name), [])
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
  }, [socials, user])

  /**
   * Ensure active tab is set appropriately on first load
   */
  useEffect(() => {
    if (!selectedSocials.includes(activeTab)) {
      setActiveTab(selectedSocials[0] ?? '')
    }
  }, [selectedSocials, activeTab])

  /**
   * Ran when genAI API error
   */
  useEffect(() => {
    if (generationError) {
      toast.error('Something went wrong, Please try again !')
    }
  }, [generationError])

  /**
   * Ran when genAI creates Posts
   */
  useEffect(() => {
    if (generatedPostContent.length === 0) {
      return
    }

    generatedPostContent.forEach(post => {
      handleContentChange(post.content, post.channel as channelType)
    })
  }, [generatedPostContent, handleContentChange])

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
        {/** Actions on top right - Schedule/publish/save */}
        <div className="hidden gap-2 py-1 lg:absolute lg:top-2 lg:right-2 lg:flex">
          <DraftActions
            handleSaveDraft={handleSaveDraft}
            handlePublishDraft={() =>
              setIsShareModalOpen({ open: true, schedule: false })
            }
            handleScheduleDraft={() =>
              setIsShareModalOpen({ open: true, schedule: true })
            }
            isActionDisabled={isDraftActionsDisabled || !user}
            isLoading={saveDraftMutation.isPending || isGenerationDataFetching}
          />
        </div>

        {/** Tabs on top left */}
        <Tabs className="w-full" value={activeTab} onValueChange={setActiveTab}>
          {/** Tabs List - Linkedin/Twitter */}
          <CreateDraftTabList
            selectedSocials={selectedSocials}
            toggleSocial={toggleSocial}
          />

          {/** Loading placeholder */}
          {selectedSocials.length === 0 && (
            <div className="mx-auto mt-2 w-full md:w-fit md:min-w-2xl">
              {(activeTab as channelType) === 'LinkedIn' ? (
                <LinkedInPostSkeleton />
              ) : (
                <TwitterPostSkeleton />
              )}
            </div>
          )}

          {/** Tabs Content */}
          {SOCIAL_PLATFORM.filter(social =>
            selectedSocials.includes(social.name)
          ).map(social => (
            <CreateDraftTabContent
              key={social.name}
              tabName={social.name}
              user={user}
              getPostComponent={getPostComponent}
            />
          ))}
        </Tabs>
      </div>

      {user && isSocialConnected(activeTab, user) && (
        <FloatingPromptInput
          onChange={(
            content: string,
            search: boolean,
            channel: string | null
          ) => {
            setUserPrompt(content)
            setUserSearch(search)
            setUserChannel((channel as channelType) ?? null)
          }}
          loading={isGenerationDataFetching || saveDraftMutation.isPending}
          hidePromptInfo
          activeChannel={activeTab as channelType}
        >
          <div className="mb-2 flex justify-center gap-2 lg:hidden">
            <DraftActions
              handleSaveDraft={handleSaveDraft}
              handlePublishDraft={() =>
                setIsShareModalOpen({ open: true, schedule: false })
              }
              handleScheduleDraft={() =>
                setIsShareModalOpen({ open: true, schedule: true })
              }
              isActionDisabled={isDraftActionsDisabled || !user}
              isLoading={saveDraftMutation.isPending}
            />
          </div>
        </FloatingPromptInput>
      )}

      {/* Share Post Modal */}
      <SharePostModal
        isOpen={isShareModalOpen}
        posts={getSharePosts()}
        isLoading={isDraftActionsDisabled()}
        onOpenChange={setIsShareModalOpen}
        onSubmit={handleSubmitDraft}
      />
    </>
  )
}

export const Route = createLazyRoute('/creation/create')({
  component: Create,
})

export default Create

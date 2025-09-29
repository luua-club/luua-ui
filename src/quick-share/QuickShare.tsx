import { createLazyRoute, useNavigate } from '@tanstack/react-router'
import { PlugZap } from 'lucide-react'

import { FloatingPromptInput } from '@/core/components/PromptInput'
import { SharePostModal } from '@/core/components/SharePostModal'
import { channelType } from '@/core/models/social.model'
import { Button } from '@/shared/ui/button'
import { Tabs } from '@/shared/ui/tabs'

import PostControls from './components/PostControls'
import TabHistoryContent from './components/TabHistoryContent'
import TabList from './components/TabList'
import TabPostContent from './components/TabPostContent'
import { useQuickShare } from './hooks/quick-share.hook'

const QuickShare = () => {
  // ---- Hooks ----
  const navigate = useNavigate()
  const {
    // state
    activeTab,
    setActiveTab,
    isShareModalOpen,
    setIsShareModalOpen,
    history,

    // data
    posts,
    extractedLinks,
    error,
    isGeneratedDataFetching,
    isLoadingPublish,
    loading,
    activeChannels,
    user,

    // actions
    refetch,
    onSubmit,
    handleEdit,
    rollbackTo,

    // setters bridging FloatingPromptInput
    setUserPrompt,
    setUserSearch,
    setUserChannel,
    clearRollback,
  } = useQuickShare()

  // ---- Functions ----
  /**
   * Returns the post controls or null if no controls are available
   *
   * @returns {JSX.Element | null} The post controls or null if no controls are available
   */
  const getPostControls = () => {
    // If there is an error or no posts are generated, return null
    if (error || posts.length === 0) return null

    // If user is not connected to any socials, return null
    if (
      !user?.connected_channels.linkedin.connected &&
      !user?.connected_channels.twitter.connected
    ) {
      return (
        <Button
          variant="destructive"
          className="text-xs"
          onClick={() =>
            navigate({ to: '/settings', search: { tabs: 'socials' } })
          }
        >
          <PlugZap />
          Connect Socials
        </Button>
      )
    }

    // If user is connected to socials, return the post controls
    return (
      <PostControls
        isLoading={loading}
        onRetry={refetch}
        onEdit={handleEdit}
        onPublish={() => setIsShareModalOpen({ open: true, schedule: false })}
        onSchedule={() => setIsShareModalOpen({ open: true, schedule: true })}
      />
    )
  }

  return (
    <>
      {/** Main Content */}
      <div className="relative m-auto max-w-7xl p-2">
        {/** Post Controls */}
        <div className="hidden gap-2 py-1 lg:absolute lg:top-2 lg:right-2 lg:flex">
          {getPostControls()}
        </div>

        {/** Tabs */}
        <Tabs
          className="w-full"
          defaultValue="created-post"
          value={activeTab}
          onValueChange={val => setActiveTab(val)}
        >
          <TabList loading={loading} />

          {/** Mobile Post Controls */}
          <div className="mt-2 flex items-center justify-center lg:hidden">
            {getPostControls()}
          </div>

          {/** Tabs Content */}
          <TabPostContent
            extractedLinks={extractedLinks}
            loading={loading}
            activeChannels={activeChannels}
            isGeneratedDataFetching={isGeneratedDataFetching}
            posts={posts}
            error={error}
            refetch={refetch}
          />

          {/** Tabs Content, History */}
          <TabHistoryContent
            history={history}
            onRollback={idx => rollbackTo(idx)}
            onSwitchToPosts={() => setActiveTab('created-post')}
          />
        </Tabs>
      </div>

      {/* Floating Prompt Input */}
      {activeTab === 'created-post' && (
        <FloatingPromptInput
          onChange={(
            content: string,
            search: boolean,
            channel: string | null
          ) => {
            // Any new prompt should exit rollback mode and show fresh generation
            clearRollback()
            setUserPrompt(content)
            setUserSearch(search)
            setUserChannel((channel as channelType) ?? null)
            setActiveTab('created-post')
          }}
          loading={loading}
          hidePromptInfo
        />
      )}

      {/* Share Post Modal */}
      <SharePostModal
        isOpen={isShareModalOpen}
        posts={posts}
        isLoading={isLoadingPublish}
        onOpenChange={setIsShareModalOpen}
        onSubmit={onSubmit}
      />
    </>
  )
}

export const Route = createLazyRoute('/quick-share')({
  component: QuickShare,
})

export default QuickShare

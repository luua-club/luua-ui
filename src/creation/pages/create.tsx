import { useMutation } from '@tanstack/react-query'
import { createLazyRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, MoreHorizontal, TriangleAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { draftsApi } from '@/core/api/drafts.api'
import LinkedInPost from '@/core/components/post-preview/LinkedInPost'
import TwitterPost from '@/core/components/post-preview/TwitterPost'
import { FloatingPromptInput } from '@/core/components/PromptInput'
import { SOCIAL_PLATFORM } from '@/core/config/constant'
import { usePublishDraft } from '@/core/hooks/publish-draft.hook'
import { useUserState } from '@/core/hooks/user-state.hook'
import { PostItem } from '@/core/models/draft.model'
import { channelType } from '@/core/models/social.model'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

import DraftActions from '../components/DraftActions'
import SocialNotConnected from '../components/SocialNotConnected'

const Create = () => {
  const user = useUserState()
  const socials = SOCIAL_PLATFORM.map(p => p.name)
  const [selectedSocials, setSelectedSocials] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<string>('')

  const [postDrafts, setPostDrafts] = useState<
    Record<channelType, { content: string }>
  >({} as Record<channelType, { content: string }>)

  const navigate = useNavigate()

  const saveDraftMutation = useMutation({
    mutationFn: (payload: { posts: Omit<PostItem, 'id'>[] }) =>
      draftsApi.postDraft(payload),
    onSuccess: () => {
      toast.success('Draft saved successfully')
    },
    onError: () => {
      toast.error('Failed to save draft')
    },
  })

  const { mutation: publishDraft } = usePublishDraft()

  // Initialize selected socials from user's connected channels when user loads/changes
  useEffect(() => {
    if (!user) {
      // No user yet, keep empty; fallback below will handle activeTab
      return
    }

    const connected = SOCIAL_PLATFORM.filter(sp => {
      return isSocialConnected(sp.name)
    }).map(sp => sp.name)

    // If none connected, default to showing all socials as a fallback
    const nextSelected = connected.length > 0 ? connected : socials
    setSelectedSocials(prev => (prev.length === 0 ? nextSelected : prev))

    // Ensure active tab is set appropriately on first load
    setActiveTab(prev => (prev ? prev : (nextSelected[0] ?? '')))
  }, [user])

  const isSocialConnected = (name: string) => {
    if (name === 'LinkedIn')
      return user?.connected_channels?.linkedin?.connected
    if (name === 'Twitter') return user?.connected_channels?.twitter?.connected
    return false
  }

  useEffect(() => {
    if (!selectedSocials.includes(activeTab)) {
      setActiveTab(selectedSocials[0] ?? '')
    }
  }, [selectedSocials, activeTab])

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

  const handleContentChange = (val: string, name: channelType) => {
    setPostDrafts(prev => ({
      ...prev,
      [name]: {
        content: val,
      },
    }))
  }

  const getPostComponent = (name: channelType) => {
    switch (name) {
      case 'LinkedIn':
        return (
          <LinkedInPost
            onContentChange={val => handleContentChange(val, name)}
            initialContent={postDrafts[name]?.content}
          />
        )
      case 'Twitter':
        return <TwitterPost />
      default:
        return null
    }
  }

  const getPostPayload = () => {
    const linkedinContent = postDrafts['LinkedIn']?.content ?? ''
    const twitterContent = postDrafts['Twitter']?.content ?? ''

    const postPayload: Omit<PostItem, 'id'>[] = []

    if (linkedinContent) {
      postPayload.push({
        channel: 'LinkedIn',
        content: linkedinContent,
        // attachments ignored intentionally for drafts save per request
      })
    }

    if (twitterContent) {
      postPayload.push({
        channel: 'Twitter',
        content: twitterContent,
        // attachments ignored intentionally for drafts save per request
      })
    }

    return postPayload
  }

  const handleSaveDraft = () => {
    const postPayload = getPostPayload()

    if (postPayload.length === 0) return
    saveDraftMutation.mutate({ posts: postPayload })
  }

  const handlePublishDraft = () => {
    const postPayload = getPostPayload()

    if (postPayload.length === 0) return
    publishDraft.mutate(
      { posts: postPayload },
      {
        onSuccess: () => {
          toast.success('Post are published successfully')
          navigate({ to: '/dashboard' })
        },
        onError: () => {
          toast.error('Failed to publish posts')
        },
      }
    )
  }

  const isActionDisabled = () => {
    if (saveDraftMutation.isPending) {
      return true
    }

    if (!postDrafts['LinkedIn']?.content && !postDrafts['Twitter']?.content) {
      return true
    }

    return false
  }

  return (
    <>
      <div className="relative m-auto max-w-7xl p-2">
        <div className="hidden gap-2 py-1 lg:absolute lg:top-2 lg:right-2 lg:flex">
          <DraftActions
            handleSaveDraft={handleSaveDraft}
            handlePublishDraft={handlePublishDraft}
            isActionDisabled={isActionDisabled}
            isLoading={saveDraftMutation.isPending}
          />
        </div>
        <Tabs className="w-full" value={activeTab} onValueChange={setActiveTab}>
          {/** Tabs List */}
          {TabList(selectedSocials, isSocialConnected, toggleSocial)}

          {/** Tabs Content */}
          {SOCIAL_PLATFORM.filter(sp => selectedSocials.includes(sp.name)).map(
            sp => (
              <TabsContent
                key={sp.name}
                value={sp.name}
                forceMount
                className="data-[state=inactive]:hidden"
              >
                {isSocialConnected(sp.name) ? (
                  <div className="mx-auto mt-2 max-w-2xl">
                    {getPostComponent(sp.name)}
                  </div>
                ) : (
                  <SocialNotConnected social={sp.name} />
                )}
              </TabsContent>
            )
          )}
        </Tabs>
      </div>

      {isSocialConnected(activeTab) && (
        <FloatingPromptInput onChange={() => {}} expandable>
          <div className="flex justify-center gap-2 lg:hidden">
            <DraftActions
              handleSaveDraft={handleSaveDraft}
              handlePublishDraft={handlePublishDraft}
              isActionDisabled={isActionDisabled}
              isLoading={saveDraftMutation.isPending}
            />
          </div>
        </FloatingPromptInput>
      )}
    </>
  )
}

const TabList = (
  selectedSocials: string[],
  isSocialConnected: (name: string) => boolean | undefined,
  toggleSocial: (name: string, checked: boolean) => void
) => {
  return (
    <TabsList className="w-full px-2 py-6 lg:w-fit">
      {selectedSocials.map(name => (
        <TabsTrigger key={name} value={name} className="px-2 py-4 text-xs">
          {(() => {
            const sp = SOCIAL_PLATFORM.find(s => s.name === name)
            if (!sp) return name
            const Icon = sp.logo
            return (
              <>
                <Icon className="size-3" />
                {name}
                {!isSocialConnected(name) && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <TriangleAlert className="size-4 shrink-0 animate-pulse text-yellow-600" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>{name} account not connected</span>
                    </TooltipContent>
                  </Tooltip>
                )}
              </>
            )
          })()}
        </TabsTrigger>
      ))}

      {selectedSocials.length === 0 && (
        <Loader2 className="size-5 animate-spin" />
      )}

      <div className="ml-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={selectedSocials.length === 0}>
            <Button variant="outline" className="!px-2">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {SOCIAL_PLATFORM.map(sp => (
              <DropdownMenuCheckboxItem
                key={sp.name}
                checked={selectedSocials.includes(sp.name)}
                onCheckedChange={val => toggleSocial(sp.name, Boolean(val))}
              >
                {sp.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TabsList>
  )
}

export const Route = createLazyRoute('/creation/create')({
  component: Create,
})

export default Create

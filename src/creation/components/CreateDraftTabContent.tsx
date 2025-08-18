import type React from 'react'

import { PostSkeleton } from '@/core/components/Post'
import {
  isMoreThanOneSocialIsConnected,
  isSocialConnected,
} from '@/core/config/utils/social.utils'
import { useUserState } from '@/core/hooks/user-state.hook'
import { channelType } from '@/core/models/social.model'
import { Switch } from '@/shared/ui/switch'
import { TabsContent } from '@/shared/ui/tabs'

import SocialNotConnected from './SocialNotConnected'

interface ICreateDraftTabContentProps {
  tabName: channelType
  isSyncing: boolean
  onToggleSync: () => void
  getPostComponent: (name: channelType) => React.ReactElement | null
}

const CreateDraftTabContent = ({
  tabName,
  isSyncing,
  onToggleSync,
  getPostComponent,
}: ICreateDraftTabContentProps) => {
  const user = useUserState()

  if (!user) {
    return <PostSkeleton />
  }

  return (
    <TabsContent
      value={tabName}
      forceMount
      className="data-[state=inactive]:hidden"
    >
      {isSocialConnected(tabName, user) ? (
        <div className="mx-auto mt-2 max-w-2xl">
          {isMoreThanOneSocialIsConnected(user) && (
            <div className="flex items-center justify-end pb-2">
              <p className="text-xs font-medium text-gray-500">Sync content</p>
              <Switch
                className="shrink-0 scale-70 cursor-pointer"
                checked={isSyncing}
                onCheckedChange={onToggleSync}
              />
            </div>
          )}
          {getPostComponent(tabName)}
        </div>
      ) : (
        <SocialNotConnected social={tabName} />
      )}
    </TabsContent>
  )
}

export default CreateDraftTabContent

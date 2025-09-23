import type React from 'react'

import { channelType } from '@/core/models/social.model'
import { UserState } from '@/core/models/user.model'
import { isSocialConnected } from '@/core/utils/social.utils'
import { TabsContent } from '@/shared/ui/tabs'

import SocialNotConnected from './SocialNotConnected'

interface ICreateDraftTabContentProps {
  tabName: channelType
  user: UserState | null
  getPostComponent: (name: channelType) => React.ReactElement | null
}

function CreateDraftTabContent({
  tabName,
  user,
  getPostComponent,
}: ICreateDraftTabContentProps) {
  if (!user) {
    return
  }

  return (
    <TabsContent
      value={tabName}
      forceMount
      className="data-[state=inactive]:hidden"
    >
      {isSocialConnected(tabName, user) ? (
        <div className="mx-auto mt-2 max-w-2xl">
          {getPostComponent(tabName)}
        </div>
      ) : (
        <SocialNotConnected social={tabName} />
      )}
    </TabsContent>
  )
}

export default CreateDraftTabContent

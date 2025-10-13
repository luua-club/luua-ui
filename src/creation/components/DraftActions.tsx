import { Calendar, Loader, PlugZap, Save, Send } from 'lucide-react'
import { useState } from 'react'

import { UserState } from '@/core/models/user.model'
import { isSomeSocialConnectedByPlan } from '@/core/utils/social.utils'
import { SourceChip } from '@/shared/components/sources-card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

import SourcesDialog from './SourcesDialog'

interface IDraftActionsProps {
  user: UserState | null
  handleSaveDraft: (callback?: () => void) => void
  handlePublishDraft: () => void
  handleScheduleDraft: () => void
  handleConnectSocials: () => void
  isLoading: boolean
  isSocialCallLoading: boolean
  extractedLinks: SourceChip[]
}

const DraftActions = ({
  user,
  handleSaveDraft,
  handlePublishDraft,
  handleScheduleDraft,
  handleConnectSocials,
  isLoading,
  isSocialCallLoading = false,
  extractedLinks,
}: IDraftActionsProps) => {
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false)

  if (!user) return null

  if (!isSomeSocialConnectedByPlan(user)) {
    return (
      <Button
        variant="destructive"
        className="text-sm"
        onClick={handleConnectSocials}
        disabled={isSocialCallLoading}
      >
        {isSocialCallLoading ? (
          <Loader className="size-3 animate-spin" />
        ) : (
          <PlugZap className="size-3" />
        )}
        Connect
      </Button>
    )
  }

  return (
    <>
      {extractedLinks.length > 0 && (
        <div className="mr-3 hidden items-center sm:flex">
          <Badge
            variant="default"
            className="cursor-pointer"
            onClick={() => setIsSourcesModalOpen(true)}
          >
            {extractedLinks.length} Sources
          </Badge>
        </div>
      )}

      {/** Sources Dialog */}
      <SourcesDialog
        isOpen={isSourcesModalOpen}
        onOpenChange={setIsSourcesModalOpen}
        extractedLinks={extractedLinks}
      />

      {/** Save Draft Button */}
      <div className="mr-2 flex gap-2 border-r pr-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="text-xs"
              onClick={() => handleSaveDraft()}
              disabled={isLoading}
            >
              <Save className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Save Draft</span>
          </TooltipContent>
        </Tooltip>
      </div>

      {/** Schedule Draft Button */}
      <Button
        variant="outline"
        className="text-xs"
        disabled={isLoading}
        onClick={handleScheduleDraft}
      >
        <Calendar className="size-3" />
        Schedule
      </Button>

      {/** Publish Draft Button */}
      <Button
        variant="default"
        className="text-xs"
        disabled={isLoading}
        onClick={handlePublishDraft}
      >
        <Send className="size-3" />
        Publish
      </Button>
    </>
  )
}

export default DraftActions

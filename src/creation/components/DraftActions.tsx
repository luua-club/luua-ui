import { Calendar, Save, Send } from 'lucide-react'
import { useState } from 'react'

import { SourceChip } from '@/shared/components/sources-card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

import SourcesDialog from './SourcesDialog'

interface IDraftActionsProps {
  handleSaveDraft: () => void
  handlePublishDraft: () => void
  handleScheduleDraft: () => void
  isLoading: boolean
  extractedLinks: SourceChip[]
}

const DraftActions = ({
  handleSaveDraft,
  handlePublishDraft,
  handleScheduleDraft,
  isLoading,
  extractedLinks,
}: IDraftActionsProps) => {
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false)

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
              onClick={handleSaveDraft}
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

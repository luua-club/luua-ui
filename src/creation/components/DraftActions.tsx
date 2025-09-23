import { Calendar, Loader2, Save, Send } from 'lucide-react'

import { Button } from '@/shared/ui/button'

interface IDraftActionsProps {
  handleSaveDraft: () => void
  handlePublishDraft: () => void
  handleScheduleDraft: () => void
  isActionDisabled: () => boolean
  isLoading: boolean
}

const DraftActions = ({
  handleSaveDraft,
  handlePublishDraft,
  handleScheduleDraft,
  isActionDisabled,
  isLoading,
}: IDraftActionsProps) => {
  return (
    <>
      <div className="mr-2 flex gap-2 border-r pr-4">
        <Button
          variant="outline"
          className="text-xs"
          onClick={handleSaveDraft}
          disabled={isActionDisabled() || isLoading}
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
        </Button>
      </div>
      <Button
        variant="outline"
        className="text-xs"
        disabled={isActionDisabled() || isLoading}
        onClick={handleScheduleDraft}
      >
        <Calendar className="size-3" />
        Schedule
      </Button>
      <Button
        variant="default"
        className="text-xs"
        disabled={isActionDisabled() || isLoading}
        onClick={handlePublishDraft}
      >
        <Send className="size-3" />
        Publish
      </Button>
    </>
  )
}

export default DraftActions

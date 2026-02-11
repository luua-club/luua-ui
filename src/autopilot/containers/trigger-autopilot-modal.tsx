import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Loader, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { autopilotApi } from '@/core/api/autopilot.api'
import { inspirationApi } from '@/core/api/inspiration.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group'
import { ScrollArea } from '@/shared/ui/scroll-area'

interface TriggerAutopilotModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function TriggerAutopilotModal({
  open,
  onOpenChange,
}: TriggerAutopilotModalProps) {
  const [selectedInspirationId, setSelectedInspirationId] = useState<
    string | null
  >(null)
  const queryClient = useQueryClient()

  // Fetch unutilized bookmarks
  const { data: bookmarksData, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.inspirations, 'unutilized'],
    queryFn: async () => {
      const response = await inspirationApi.getInspirations({
        limit: 25,
        offset: 0,
      })
      return response.data.inspirations.filter(
        inspiration => !inspiration.utilized
      )
    },
    enabled: open,
  })

  // Trigger autopilot mutation
  const triggerMutation = useMutation({
    mutationFn: (inspirationId: string) =>
      autopilotApi.triggerAutopilot({ inspiration_id: inspirationId }),
    onSuccess: () => {
      toast.success('Autopilot triggered successfully!')
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.drafts],
      })
      onOpenChange(false)
      setSelectedInspirationId(null)
    },
    onError: () => {
      toast.error('Failed to trigger autopilot')
    },
  })

  const handleTrigger = () => {
    if (!selectedInspirationId) {
      toast.error('Please select a bookmark')
      return
    }
    triggerMutation.mutate(selectedInspirationId)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card w-full p-5 md:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-card-foreground flex items-center gap-2">
            <Sparkles className="size-5" />
            Select Bookmark to Generate Post
          </DialogTitle>
          <DialogDescription>
            Choose an unused bookmark to generate a new post draft
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="size-6 animate-spin" />
            </div>
          ) : !bookmarksData || bookmarksData.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              <p>No unused bookmarks available.</p>
              <p className="mt-2 text-sm">
                Please add new bookmarks to trigger autopilot.
              </p>
              <Link
                to="/bookmarks"
                className="text-primary mt-4 inline-block text-sm font-medium underline hover:no-underline"
                onClick={() => onOpenChange(false)}
              >
                Go to Bookmarks
              </Link>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <RadioGroup
                value={selectedInspirationId || ''}
                onValueChange={setSelectedInspirationId}
              >
                <div className="space-y-3">
                  {bookmarksData.map(inspiration => (
                    <div
                      key={inspiration.id}
                      className="hover:bg-accent flex items-start space-x-3 rounded-lg border p-4"
                    >
                      <RadioGroupItem
                        value={inspiration.id}
                        id={inspiration.id}
                        className="mt-1"
                      />
                      <label
                        htmlFor={inspiration.id}
                        className="text-card-foreground flex-1 cursor-pointer"
                      >
                        <div className="font-medium">{inspiration.link}</div>
                        {inspiration.additional_context && (
                          <div className="text-muted-foreground mt-1 text-sm">
                            {inspiration.additional_context}
                          </div>
                        )}
                        <div className="text-muted-foreground mt-2 text-xs">
                          Added on{' '}
                          {new Date(
                            inspiration.created_at
                          ).toLocaleDateString()}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </ScrollArea>
          )}
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={triggerMutation.isPending}
            className="text-card-foreground"
          >
            Cancel
          </Button>
          <Button
            onClick={handleTrigger}
            disabled={
              !selectedInspirationId ||
              triggerMutation.isPending ||
              !bookmarksData ||
              bookmarksData.length === 0
            }
          >
            {triggerMutation.isPending ? (
              <>
                <Loader className="size-4 animate-spin" />
                Triggering...
              </>
            ) : (
              'Trigger Autopilot'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TriggerAutopilotModal

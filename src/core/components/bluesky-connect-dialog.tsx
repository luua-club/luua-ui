import { useQueryClient } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { oauthApi } from '@/core/api/oauth.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

type BlueskyConnectDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function BlueskyConnectDialog({
  open,
  onOpenChange,
}: BlueskyConnectDialogProps) {
  const queryClient = useQueryClient()
  const [handle, setHandle] = useState('')
  const [appPassword, setAppPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!handle.trim() || !appPassword.trim()) return
    try {
      setIsSubmitting(true)
      await oauthApi.blueskyConnect(handle.trim(), appPassword.trim())
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] })
      toast.success('Connected to Bluesky')
      onOpenChange(false)
      setHandle('')
      setAppPassword('')
    } catch {
      toast.error(
        'Failed to connect to Bluesky. Check your handle and app password.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card w-[calc(100vw-2rem)] max-w-lg p-5 md:w-full">
        <DialogHeader>
          <DialogTitle>Connect Bluesky</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Enter your Bluesky handle and an app password to connect your
            account.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bluesky-handle">Handle</Label>
            <Input
              id="bluesky-handle"
              placeholder="e.g. you.bsky.social"
              value={handle}
              onChange={e => setHandle(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bluesky-app-password">App Password</Label>
            <Input
              id="bluesky-app-password"
              type="password"
              placeholder="xxxx-xxxx-xxxx-xxxx"
              value={appPassword}
              onChange={e => setAppPassword(e.target.value)}
              disabled={isSubmitting}
            />
            <p className="text-muted-foreground text-xs">
              Create an app password in{' '}
              <a
                href="https://bsky.app/settings/app-passwords"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2"
              >
                Bluesky Settings → Privacy and Security → App Passwords
              </a>
              .
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!handle.trim() || !appPassword.trim() || isSubmitting}
          >
            {isSubmitting && <Loader className="size-4 animate-spin" />}
            Connect
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BlueskyConnectDialog

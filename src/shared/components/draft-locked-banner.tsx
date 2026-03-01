import { Lock, RefreshCw } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'

interface DraftLockedBannerProps {
  name: string
  email: string
}

export function DraftLockedBanner({ name, email }: DraftLockedBannerProps) {
  return (
    <Alert className="border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-200">
      <Lock className="size-4 text-amber-600 dark:text-amber-400" />
      <AlertTitle>This draft is currently being edited</AlertTitle>
      <AlertDescription className="text-amber-800 dark:text-amber-300">
        <p>
          {name}
          {email ? ` (${email})` : ''} is currently working on this draft.
          Please wait for them to finish, or reload to check if the draft is
          available.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2 border-amber-400 bg-amber-100 text-amber-900 hover:bg-amber-200 dark:border-amber-600 dark:bg-amber-900 dark:text-amber-200 dark:hover:bg-amber-800"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="size-3.5" />
          Reload
        </Button>
      </AlertDescription>
    </Alert>
  )
}

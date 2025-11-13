import { Megaphone } from 'lucide-react'

import { Button } from '@/shared/ui/button'

function ExtentionCallout() {
  return (
    <div className="flex items-center justify-between rounded-sm border border-orange-600 bg-orange-50/10 p-4 font-medium text-orange-600 dark:border-orange-400 dark:bg-orange-600/10 dark:text-orange-400">
      <p className="flex items-center gap-2">
        <Megaphone className="size-5" />
        The better, faster way to add bookmarks is through Luua Chrome extension
        !
      </p>
      <Button
        size={'sm'}
        variant="destructive"
        className="bg-orange-600 text-white dark:bg-orange-400 dark:font-semibold dark:text-black"
      >
        Download Now
      </Button>
    </div>
  )
}

export default ExtentionCallout

import { Megaphone } from 'lucide-react'

import { EXTERNAL_URLS } from '@/core/config/constant'
import { Button } from '@/shared/ui/button'

function ExtentionCallout() {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-sm border border-orange-600 bg-orange-50/10 p-4 font-medium text-orange-600 lg:flex-row lg:items-center dark:border-orange-400 dark:bg-orange-600/10 dark:text-orange-400">
      <p className="flex items-center gap-2">
        <Megaphone className="hidden size-5 lg:block" />
        Pro Tip: Save links instantly while you browse!
      </p>
      <Button
        size={'sm'}
        variant="destructive"
        className="bg-orange-600 text-white dark:bg-orange-400 dark:font-semibold dark:text-black"
        onClick={() => window.open(EXTERNAL_URLS.chromeExt, '_blank')}
      >
        Add Luua to Chrome
      </Button>
    </div>
  )
}

export default ExtentionCallout

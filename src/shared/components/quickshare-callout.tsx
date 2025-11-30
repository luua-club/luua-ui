import { CircleAlertIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '../ui/alert'

interface QuickShareCalloutProps {
  children?: React.ReactNode
}

const QuickShareCallout = ({ children }: QuickShareCalloutProps) => {
  return (
    <Alert className="border-2 border-dashed p-4">
      <CircleAlertIcon className="!size-4.5 !text-blue-600 dark:!text-blue-400" />
      <AlertTitle>Not ready to connect your social accounts ?</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-4">
        Quick Share lets you publish your post instantly by opening a pre-filled
        share window on respective social media. You can later delete the draft
        manually.
        {children}
      </AlertDescription>
    </Alert>
  )
}

export default QuickShareCallout

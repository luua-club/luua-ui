import { CircleAlertIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '../ui/alert'

interface QuickShareCalloutProps {
  children?: React.ReactNode
}

const QuickShareCallout = ({ children }: QuickShareCalloutProps) => {
  return (
    <Alert className="border-2 border-dashed p-4">
      <CircleAlertIcon className="!size-4.5 !text-blue-600 dark:!text-blue-400" />
      <AlertTitle>Prefer to post manually?</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-4">
        Post instantly without connecting your account. This opens the native LinkedIn/Twitter editor with your text ready to go.
        {children}
      </AlertDescription>
    </Alert>
  )
}

export default QuickShareCallout

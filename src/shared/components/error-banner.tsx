import { X } from 'lucide-react'

function ErrorBanner() {
  return (
    <div className="bg-destructive/5 border-destructive/30 m-auto mt-8 flex h-18 max-w-4xl items-center justify-center rounded-sm border-1 p-5">
      <p className="text-destructive flex items-center gap-1 text-sm font-semibold">
        <X className="size-5" /> Something Went Wrong. Please Retry After Some
        Time
      </p>
    </div>
  )
}

export default ErrorBanner

import { LoaderCircle } from 'lucide-react'

const GlobalLoader = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <LoaderCircle className="size-10 animate-spin" />
    </div>
  )
}

export default GlobalLoader

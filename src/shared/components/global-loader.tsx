import { Loader } from 'lucide-react'
import { useEffect, useState } from 'react'

function GlobalLoader() {
  // --- States ---
  const [showLoader, setShowLoader] = useState(false)

  // --- Effects ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  // --- Early Return ---
  if (!showLoader) return null

  // --- Render ---
  return (
    <div className="relative min-h-[calc(100vh-var(--spacing-nav-height))]">
      <Loader className="absolute top-[40%] left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 animate-spin duration-75" />
    </div>
  )
}

export default GlobalLoader

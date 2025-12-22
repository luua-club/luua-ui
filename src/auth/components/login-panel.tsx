import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { Loader } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import LuuaLogo from '@/assets/images/luua-full.svg?react'
import LuuaLogoDark from '@/assets/images/luua-full-black.svg?react'
import { Highlighter } from '@/shared/ui/highlighter'

interface LoginPanelProps {
  isLoading: boolean
  onLogin: (credentialResponse: CredentialResponse) => void
}

function LoginPanel({ isLoading, onLogin }: LoginPanelProps) {
  // ---- States ----
  // Show the Google button only after its iframe is present to avoid snap
  const [buttonReady, setButtonReady] = useState(false)
  const buttonRef = useRef<HTMLDivElement | null>(null)

  // ---- Hooks ----
  /**
   * Show the Google button only after its iframe is present to avoid snap
   */
  useEffect(() => {
    if (isLoading) return

    const el = buttonRef.current
    if (!el) return

    // Already mounted?
    if (el.querySelector('iframe')) {
      // Next frame to allow paint before transition, then small delay for smoother entrance
      const rafId = requestAnimationFrame(() => {
        const tId = window.setTimeout(() => setButtonReady(true), 250)
        // cleanup mirrors below return
        ;(cleanupFns => cleanupFns.push(() => window.clearTimeout(tId)))(
          cleanup
        )
      })
      const cleanup: Array<() => void> = [() => cancelAnimationFrame(rafId)]
      return () => cleanup.forEach(fn => fn())
    }

    const observer = new MutationObserver(() => {
      if (el.querySelector('iframe')) {
        // slight delay so the iframe has painted before we reveal
        window.setTimeout(() => setButtonReady(true), 250)
        observer.disconnect()
      }
    })
    observer.observe(el, { childList: true, subtree: true })

    // Fallback in case iframe takes too long
    const timeout = window.setTimeout(() => {
      // even on fallback, keep a tiny delay to maintain consistency
      window.setTimeout(() => setButtonReady(true), 150)
      observer.disconnect()
    }, 1500)

    return () => {
      observer.disconnect()
      window.clearTimeout(timeout)
    }
  }, [isLoading])

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-12">
      <div className="flex flex-col items-center gap-6">
        {/** Logo */}
        <LuuaLogo className="hidden w-72 sm:w-96 xl:h-[120px] xl:w-[500px] dark:block" />

        {/** Logo Dark */}
        <LuuaLogoDark className="w-72 sm:w-96 xl:h-[120px] xl:w-[500px] dark:hidden" />

        {/** Tagline */}
        <Highlighter
          action="underline"
          color="#FF9800"
          padding={4}
          animationDuration={500}
          iterations={8}
        >
          <p className="text-xl font-bold sm:text-2xl">
            For strategically lazy people.
          </p>
        </Highlighter>
      </div>

      {/** Description */}
      <div className="flex flex-col items-center gap-10">
        <p className="text-center text-base font-medium text-balance text-gray-600 sm:text-lg dark:text-gray-300">
          From idea to post, everything is automated,
          <br className="hidden sm:block" />
          making brand-building effortless with Luua.
        </p>

        {/** Login Button (reserve space and fade-in when iframe is ready) */}
        <div className="relative -mt-2 flex h-[44px] w-[280px] items-center justify-center">
          {isLoading ? (
            <Loader className="size-6 animate-spin" />
          ) : (
            <div
              ref={buttonRef}
              className={`w-full transform-gpu transition-opacity duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity] ${
                buttonReady ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <GoogleLogin
                onSuccess={onLogin}
                onError={() => {
                  toast.error('Something went wrong, Please try again !')
                }}
                theme="outline"
                text="continue_with"
                width={280}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginPanel

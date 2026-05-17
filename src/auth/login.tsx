import { createLazyRoute } from '@tanstack/react-router'

import { useTheme } from '@/shared/provider/theme-provider'
import { Spotlight } from '@/shared/ui/spotlight-new'
import { cn } from '@/shared/utils'

import LeftPanel from './components/left-panel/left-panel'
import RightPanel from './components/right-panel/right-panel'
import { useLoginAuth } from './hooks/use-login-auth'

function Login() {
  // ---- Business logic (API, storage, redirects) ----
  const auth = useLoginAuth()

  // ---- Layout-only ----
  const { theme } = useTheme()

  return (
    <div
      className={cn(
        'relative flex min-h-0 w-full overflow-hidden',
        'bg-background h-dvh'
      )}
    >
      <Spotlight />
      <LeftPanel auth={auth} />
      <RightPanel theme={theme} />
    </div>
  )
}

//--- Lazy Route ---
export const Route = createLazyRoute('/login')({
  component: Login,
})

export default Login

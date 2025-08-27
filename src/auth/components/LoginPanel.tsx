import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import LuuaLogo from '@/assets/images/luua-full-black.svg?react'
import { Highlighter } from '@/shared/ui/highlighter'

interface LoginPanelProps {
  isLoading: boolean
  onLogin: (credentialResponse: CredentialResponse) => void
}

function LoginPanel({ isLoading, onLogin }: LoginPanelProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-5">
      {/** Logo */}
      <LuuaLogo className="w-72 lg:w-96 xl:h-[120px] xl:w-[400px]" />

      {/** Tagline */}
      <Highlighter action="underline" color="var(--brand-accent-yellow)">
        <p className="text-base font-bold text-black lg:text-xl">
          For strategically lazy people.
        </p>
      </Highlighter>

      {/** Description */}
      <div className="mt-8 flex flex-col items-center gap-8 md:mt-6">
        <p className="text-center text-base font-medium text-gray-600 md:text-lg">
          From idea to post, everything is automated,
          <br className="hidden lg:block" />
          making brand-building effortless with Luua.
        </p>

        {/** Login Button */}
        {isLoading ? (
          <Loader2 className="h-10 w-10 animate-spin" color="black" />
        ) : (
          <GoogleLogin
            onSuccess={onLogin}
            onError={() => {
              toast.error('Something went wrong, Please try again !')
            }}
            theme="filled_black"
            text="continue_with"
            width={280}
          />
        )}
      </div>
    </div>
  )
}

export default LoginPanel

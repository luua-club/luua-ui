import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { Loader2 } from 'lucide-react'

import { cn } from '@/shared/utils'

interface LoginPanelProps {
  isLoading: boolean
  onLogin: (credentialResponse: CredentialResponse) => void
}

function LoginPanel({ isLoading, onLogin }: LoginPanelProps) {
  return (
    <div className="flex flex-col items-center">
      <h1 className={cn('text-5xl font-bold', 'lg:text-6xl', 'xl:text-7xl')}>
        Login to Luua
      </h1>
      <p
        className={cn(
          'pt-4 text-center text-base text-gray-400',
          'lg:text-xl',
          'xl:text-2xl'
        )}
      >
        Step into high class marketing <br /> boost your productivity.
      </p>
      <div className="w-[80%] pt-8">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        ) : (
          <GoogleLogin
            onSuccess={onLogin}
            onError={() => {
              /** TODO: Show error notification */
              console.log('Google login failed')
            }}
            theme="filled_black"
            text="continue_with"
            width={'100%'}
          />
        )}
      </div>
    </div>
  )
}

export default LoginPanel

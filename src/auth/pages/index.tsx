import { GoogleLogin } from '@react-oauth/google'

import { cn } from '@/shared/utils'

const Login = () => {
  return (
    <div className="bg-background flex h-screen w-screen">
      <div
        className={cn('flex w-full items-center justify-center', 'md:flex-1/2')}
      >
        <div className="flex flex-col items-center">
          <h1
            className={cn('text-5xl font-bold', 'lg:text-6xl', 'xl:text-7xl')}
          >
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
            <GoogleLogin
              onSuccess={credentialResponse => {
                console.log('Google login success:', credentialResponse)
              }}
              onError={() => {
                console.log('Google login failed')
              }}
            />
          </div>
        </div>
      </div>
      <div
        className={cn('bg-brand-background-dark hidden flex-1/2', 'md:block')}
      >
        {/* TODO: Add items here */}
      </div>
    </div>
  )
}

export default Login

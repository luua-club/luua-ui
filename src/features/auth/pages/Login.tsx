import { ChevronRight, Mail } from 'lucide-react'

import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils'

const Login = () => {
  return (
    <div className="bg-background flex h-screen w-screen">
      <div
        className={cn(
          'flex w-full items-center justify-center',
          'md:flex-1/2',
          'lg:justify-start lg:pl-15',
          'xl:pl-20'
        )}
      >
        <div className="flex flex-col">
          <h1
            className={cn('text-5xl font-bold', 'lg:text-6xl', 'xl:text-7xl')}
          >
            Login to Luua
          </h1>
          <p
            className={cn(
              'pt-4 text-base text-gray-400',
              'lg:text-xl',
              'xl:text-2xl'
            )}
          >
            Step into high class marketing boost <br /> your productivity.
          </p>
          <Button
            className={cn('mt-8 w-full text-xs', 'lg:text-sm', 'xl:text-base')}
            variant={'brandAccent'}
            size={'lg'}
          >
            <Mail />
            Sign in with Google
            <ChevronRight />
          </Button>
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

import { createLazyRoute } from '@tanstack/react-router'
import { Play } from 'lucide-react'

import PromptInput from '@/core/containers/PromptInput'
import { Button } from '@/shared/ui/button'

const Dashboard = () => {
  return (
    <div className="m-auto grid max-w-7xl grid-cols-1 gap-8 p-5 md:grid-cols-1 md:grid-rows-none lg:grid-cols-3 lg:grid-rows-2 lg:gap-16">
      {/* User prompt */}
      <div className="lg:col-span-2 lg:row-span-1">
        <h2 className="pb-4 text-2xl text-gray-500">Ready when you are.</h2>
        <PromptInput />
        <div className="mt-4 flex w-full max-w-[700px] items-center justify-end gap-2">
          <p className="text-sm text-gray-600">Not sure where to start ? </p>
          <Button className="bg-brand-accent-yellow border-1 border-black text-sm text-black hover:text-white">
            Click here
            <Play />
          </Button>
        </div>
      </div>
      {/* Recent post */}
      <div className="rounded-lg lg:col-span-1 lg:row-span-2">
        {/* Content for the second column */}
      </div>
      {/* Scheduled post */}
      <div className="rounded-lg lg:col-span-2 lg:row-span-1">
        {/* Content for the first column, second row */}
      </div>
    </div>
  )
}

export const Route = createLazyRoute('/dashboard')({
  component: Dashboard,
})

export default Dashboard

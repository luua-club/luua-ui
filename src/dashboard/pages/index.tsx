import { createLazyRoute } from '@tanstack/react-router'

import PromptInput from '@/core/containers/PromptInput'

const Dashboard = () => {
  return (
    <div className="m-auto grid max-w-7xl grid-cols-1 gap-8 p-5 md:grid-cols-1 md:grid-rows-none lg:grid-cols-3 lg:grid-rows-2 lg:gap-16">
      {/* User prompt */}
      <div className="lg:col-span-2 lg:row-span-1">
        <PromptInput />
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

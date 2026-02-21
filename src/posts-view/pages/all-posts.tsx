import { createLazyRoute, Link, Outlet } from '@tanstack/react-router'

import { cn } from '@/shared/utils'

const tabClass = cn(
  'pb-2 px-3 text-sm font-medium border-b-2 border-transparent text-muted-foreground transition-colors',
  '[&.active]:border-primary [&.active]:text-foreground'
)

function AllPosts() {
  return (
    <div className="flex flex-col">
      <div className="mt-14 mb-4 flex items-end border-b md:mt-4">
        <Link to="/posts-view/calendar" className={tabClass}>
          Calendar View
        </Link>
        <Link to="/posts-view/list" className={tabClass}>
          List View
        </Link>
      </div>
      <Outlet />
    </div>
  )
}

export const Route = createLazyRoute('/posts-view')({
  component: AllPosts,
})

export default AllPosts

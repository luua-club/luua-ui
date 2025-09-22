import { createLazyRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'

function AutoGenPage() {
  return <Outlet />
}

export const Route = createLazyRoute('/auto-gen')({
  component: AutoGenPage,
})

export default AutoGenPage

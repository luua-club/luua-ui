import { createLazyRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'

const CreationPage = () => {
  return <Outlet />
}

export const Route = createLazyRoute('/creation')({
  component: CreationPage,
})

export default CreationPage

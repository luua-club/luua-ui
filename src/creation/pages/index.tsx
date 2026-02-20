import { createLazyRoute, Outlet } from '@tanstack/react-router'

const CreationPage = () => <Outlet />

export const Route = createLazyRoute('/creation')({
  component: CreationPage,
})

export default CreationPage

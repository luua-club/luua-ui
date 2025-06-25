import './App.css'

import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

const rootRoute = createRootRoute({
  component: App,
})

function App() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  )
}

export default rootRoute

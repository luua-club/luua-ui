import { createLazyRoute } from '@tanstack/react-router'

const Dashboard = () => {
  return (
    <div>
      <h1>{''}</h1>
    </div>
  )
}

export const Route = createLazyRoute('/dashboard')({
  component: Dashboard,
})

export default Dashboard

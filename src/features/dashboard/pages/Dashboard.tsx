import { createLazyRoute } from '@tanstack/react-router'

const Dashboard = () => {
  return <h1>Dashboard</h1>
}

export const Route = createLazyRoute('/dashboard')({
  component: Dashboard,
})

export default Dashboard

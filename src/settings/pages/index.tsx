import { createLazyRoute } from '@tanstack/react-router'

const Settings = () => {
  return <div>{''}</div>
}

export const Route = createLazyRoute('/settings')({
  component: Settings,
})

export default Settings

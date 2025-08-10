import { createLazyRoute } from '@tanstack/react-router'

const Drafts = () => {
  return (
    <div>
      <h1>Drafts Page</h1>
    </div>
  )
}

export const Route = createLazyRoute('/creation/drafts')({
  component: Drafts,
})

export default Drafts

import { createLazyRoute } from '@tanstack/react-router'

import DraftsContainer from '@/core/containers/Drafts'

const Drafts = () => {
  return <DraftsContainer />
}

export const Route = createLazyRoute('/drafts')({
  component: Drafts,
})

export default Drafts

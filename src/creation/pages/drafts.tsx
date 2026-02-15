import { createLazyRoute, useSearch } from '@tanstack/react-router'

import DraftsContainer from '../../core/containers/Drafts'

const Drafts = () => {
  const search = useSearch({ from: '/creation/drafts' })
  const inspirationId = (search as { inspiration_id?: string }).inspiration_id

  return <DraftsContainer inspirationId={inspirationId} />
}

export const Route = createLazyRoute('/creation/drafts')({
  component: Drafts,
})

export default Drafts

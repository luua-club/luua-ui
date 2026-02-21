import { createLazyRoute, useSearch } from '@tanstack/react-router'

import DraftsContainer from '../core/containers/Drafts'

const Drafts = () => {
  const search = useSearch({ from: '/drafts' })
  const inspirationId = (search as { inspiration_id?: string }).inspiration_id

  return (
    <div className="mt-12 md:mt-2">
      <DraftsContainer inspirationId={inspirationId} />
    </div>
  )
}

export const Route = createLazyRoute('/drafts')({
  component: Drafts,
})

export default Drafts

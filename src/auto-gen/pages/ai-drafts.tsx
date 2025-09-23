import { createLazyRoute } from '@tanstack/react-router'

import Drafts from '@/core/containers/Drafts'

function AIDrafts() {
  return <Drafts showOnlyAutoGen />
}

export const Route = createLazyRoute('/auto-gen/drafts')({
  component: AIDrafts,
})

export default AIDrafts

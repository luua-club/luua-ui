import { createLazyRoute } from '@tanstack/react-router'

function AIDrafts() {
  return <div>AIDrafts</div>
}

export const Route = createLazyRoute('/auto-gen/drafts')({
  component: AIDrafts,
})

export default AIDrafts

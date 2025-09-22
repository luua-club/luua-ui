import { createLazyRoute } from '@tanstack/react-router'

function Inspiration() {
  return <div>Inspiration</div>
}

export const Route = createLazyRoute('/auto-gen/inspiration')({
  component: Inspiration,
})

export default Inspiration

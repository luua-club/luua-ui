import { createLazyRoute } from '@tanstack/react-router'

function Bookmarks() {
  return <div>Bookmarks</div>
}

//--- Lazy Route ---
export const Route = createLazyRoute('/bookmarks')({
  component: Bookmarks,
})

export default Bookmarks

import { createLazyRoute } from '@tanstack/react-router'

function PostListView() {
  return <h1>WIP</h1>
}

export const Route = createLazyRoute('/posts-view/list')({
  component: PostListView,
})

export default PostListView

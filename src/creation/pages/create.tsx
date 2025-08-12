import { createLazyRoute } from '@tanstack/react-router'

const Create = () => {
  return (
    <div>
      <h1>Create Page</h1>
    </div>
  )
}

export const Route = createLazyRoute('/creation/create')({
  component: Create,
})

export default Create

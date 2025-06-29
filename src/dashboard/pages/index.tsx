import { createLazyRoute } from '@tanstack/react-router'

const Dashboard = () => {
  // TODO: logout
  // const router = useRouter()
  // const dispatch = useAppDispatch()

  // const handleLogout = () => {
  //   dispatch(clearUser())
  //   removeLocalStorageItem(LUUA_USER_KEY)
  //   router.navigate({ to: '/login' })
  // }

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )
}

export const Route = createLazyRoute('/dashboard')({
  component: Dashboard,
})

export default Dashboard

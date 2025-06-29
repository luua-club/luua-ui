import './App.css'

import { Outlet, useRouter } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useEffect } from 'react'

import { setUser } from './auth/auth-slice'
import { userApi } from './core/api/user.api'
import { LUUA_USER_KEY } from './core/config/constant'
import { getLocalStorageItem } from './core/config/utils/localstorage.util'
import { useAppDispatch } from './core/hooks/global-state.hook'

function App() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    // Check if JWT token is present in local storage
    const token = getLocalStorageItem(LUUA_USER_KEY)
    if (!token) {
      // If user is not logged in
      // and the current path is not login, redirect to login
      if (router.state.location.pathname === '/login') {
        return
      }
      router.navigate({ to: '/login' })
      return
    }

    // If user logged in, but page is refreshed, get fresh user data for redux store
    // If user is not logged in, the base API will handle the 401 error and redirect to login
    userApi.getUser().then(res => dispatch(setUser(res.data)))
  }, [])

  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  )
}

export default App

import { CredentialResponse } from '@react-oauth/google'
import { useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { authApi } from '@/core/api/auth.api'
import { LUUA_USER_KEY } from '@/core/config/constant'
import {
  removeLocalStorageItem,
  setLocalStorageItem,
} from '@/core/config/utils/localstorage.util'
import { useAppDispatch } from '@/core/hooks/global-state.hook'
import { ILoginResponse } from '@/core/models/auth.model'
import { cn } from '@/shared/utils'

import { clearUser, setUser } from '../../core/store/auth-slice'
import LoginPanel from '../components/LoginPanel'

function Login() {
  // UseStates
  const [isLoading, setIsLoading] = useState(false)

  // UseHooks
  const router = useRouter()
  const dispatch = useAppDispatch()

  // Constants
  const key = LUUA_USER_KEY

  useEffect(() => {
    // Clear user and local storage on mount
    dispatch(clearUser())
    removeLocalStorageItem(key)
  }, [])

  /**
   * Handles the login process
   *
   * @param credentialResponse - The credential response from Google
   * @returns The login response
   */
  const onLogin = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return
    setIsLoading(true)

    // Login the user to Backend
    // Get the response and update the store and local storage
    // Redirect to the dashboard
    authApi
      .login({
        token: credentialResponse.credential,
      })
      .then(response => {
        setIsLoading(false)
        updateDataAndRedirect(response.data)
      })
      .catch(error => {
        // TODO: Show error notification
        setIsLoading(false)
        console.log(error, 'error')
      })
  }

  /**
   * Updates the store and redirects to the dashboard
   *
   * @param res - The login response
   */
  const updateDataAndRedirect = (res: ILoginResponse) => {
    dispatch(setUser(res.user))
    setLocalStorageItem(key, res)
    router.navigate({ to: '/dashboard' })
  }

  return (
    <div className="bg-background flex min-h-screen w-screen">
      <div
        className={cn('flex w-full items-center justify-center', 'md:flex-1/2')}
      >
        <LoginPanel isLoading={isLoading} onLogin={onLogin} />
      </div>
      <div
        className={cn('bg-brand-background-dark hidden flex-1/2', 'md:block')}
      >
        {/* TODO: Add items here */}
      </div>
    </div>
  )
}

export default Login

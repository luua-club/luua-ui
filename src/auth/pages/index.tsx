import { CredentialResponse } from '@react-oauth/google'
import { useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { authApi } from '@/core/api/auth.api'
import { userApi } from '@/core/api/user.api'
import { LUUA_USER_KEY } from '@/core/config/constant'
import { useAppDispatch } from '@/core/hooks/global-state.hook'
import { ILoginResponse } from '@/core/models/auth.model'
import { cn } from '@/shared/utils'
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from '@/shared/utils/localstorage.util'

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
        updateDataAndRedirect(response.data)
      })
      .catch(() => {
        setIsLoading(false)
        toast.error(
          'Something went wrong, Not able to login, Please try again !'
        )
      })
  }

  /**
   * Updates the store and redirects to the dashboard
   *
   * @param res - The login response
   */
  const updateDataAndRedirect = async (res: ILoginResponse) => {
    dispatch(setUser(res.user))
    setLocalStorageItem(key, res)

    try {
      const response = await userApi.getUser()
      dispatch(setUser(response.data))
      setLocalStorageItem(key, {
        ...getLocalStorageItem<ILoginResponse>(key),
        user: response.data,
      })
      router.navigate({ to: '/dashboard' })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Something went wrong, Not able to login, Please try again !')
    } finally {
      setIsLoading(false)
    }
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

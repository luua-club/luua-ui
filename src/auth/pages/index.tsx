import { CredentialResponse } from '@react-oauth/google'
import {
  useIsFetching,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { authApi } from '@/core/api/auth.api'
import { userApi } from '@/core/api/user.api'
import { LUUA_USER_KEY, QUERY_KEYS } from '@/core/config/constant'
import { useAppDispatch } from '@/core/hooks/global-state.hook'
import { LoginResponse } from '@/core/models/auth.model'
import { StarsBackground } from '@/shared/ui/star-background'
import { cn } from '@/shared/utils'
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from '@/shared/utils/localstorage.util'

import { clearUser, setUser } from '../../core/store/auth-slice'
import InfoPanelOverlay from '../components/InfoPanelOverlay'
import LoginPanel from '../components/LoginPanel'

function Login() {
  // ---- Variables ----
  const key = useMemo(() => LUUA_USER_KEY, [])

  // ---- Hooks ----
  const router = useRouter()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const [mounted, setMounted] = useState(false)
  const loginMutation = useMutation({
    mutationFn: (token: string) =>
      authApi.login({
        token,
      }),
    onSuccess: response => {
      updateDataAndRedirect(response.data)
    },
    onError: () => {
      toast.error('Something went wrong, Please try again !')
    },
  })
  const isFetchingUser = useIsFetching({ queryKey: [QUERY_KEYS.user] })

  // ---- Effects ----
  useEffect(() => {
    // Clear user and local storage on mount
    dispatch(clearUser())
    removeLocalStorageItem(key)
  }, [dispatch, key])

  // Defer animations until after first mount to avoid flash
  useEffect(() => {
    setMounted(true)
  }, [])

  /**
   * Handles the login process
   *
   * @param credentialResponse - The credential response from Google
   * @returns The login response
   */
  const onLogin = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return
    loginMutation.mutate(credentialResponse.credential)
  }

  /**
   * Updates the store and redirects to the dashboard
   *
   * @param res - The login response
   */
  const updateDataAndRedirect = async (res: LoginResponse) => {
    setLocalStorageItem(key, res)

    try {
      const response = await queryClient.fetchQuery({
        queryKey: [QUERY_KEYS.user],
        queryFn: () => userApi.getUser(),
        staleTime: 0,
        retry: false,
      })

      dispatch(setUser(response.data))
      setLocalStorageItem(key, {
        ...getLocalStorageItem<LoginResponse>(key),
        user: response.data,
      })

      router.navigate({ to: '/dashboard' })
    } catch {
      removeLocalStorageItem(key)
      toast.error('Something went wrong, Please try again !')
    }
  }

  return (
    <div className="flex min-h-screen w-screen">
      {/** Left Panel */}
      <div
        className={cn(
          'relative flex w-full items-center justify-center',
          'md:flex-1/2'
        )}
      >
        {/** Background grid */}
        <div className="absolute inset-0 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/** Login */}
        <div
          className={cn(
            'z-1 h-full w-full',
            !mounted && 'opacity-0',
            mounted &&
              'motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 transform-gpu will-change-[transform,opacity] motion-safe:delay-75 motion-safe:duration-700 motion-safe:ease-out'
          )}
        >
          <LoginPanel
            isLoading={loginMutation.isPending || isFetchingUser > 0}
            onLogin={onLogin}
          />
        </div>
      </div>

      {/** Right Panel */}
      <div
        className={cn(
          'bg-brand-background-dark m-1.5 hidden flex-1/2 overflow-clip rounded-3xl',
          'md:block'
        )}
      >
        <StarsBackground className="flex aspect-16/9 items-center justify-center">
          <InfoPanelOverlay />
        </StarsBackground>
      </div>
    </div>
  )
}

export default Login

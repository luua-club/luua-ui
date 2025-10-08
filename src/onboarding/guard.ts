import { redirect } from '@tanstack/react-router'

import { LUUA_USER_KEY } from '@/core/config/constant'
import { LoginResponse } from '@/core/models/auth.model'
import { getLocalStorageItem } from '@/shared/utils/localstorage.util'

export const OnboardingGuard = () => {
  const loginResponse = getLocalStorageItem<LoginResponse>(LUUA_USER_KEY)
  const isNewUser = !!loginResponse?.new_user

  if (!isNewUser) {
    throw redirect({ to: '/dashboard' })
  }

  return {}
}

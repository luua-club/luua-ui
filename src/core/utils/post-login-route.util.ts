import { LoginResponse } from '@/core/models/auth.model'
import { User } from '@/core/models/user.model'

type StoredAuthUser = User & Record<string, unknown>

type PostLoginRouteParams = {
  loginResponse?: Partial<LoginResponse> | null
  user?: StoredAuthUser | null
}

type AppRoute = '/welcome' | '/dashboard'

const toBoolean = (value: unknown): boolean | null => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const normalizedValue = value.trim().toLowerCase()
    if (normalizedValue === 'true') return true
    if (normalizedValue === 'false') return false
  }
  if (typeof value === 'number') {
    if (value === 1) return true
    if (value === 0) return false
  }
  return null
}

const readBooleanField = (
  source: Record<string, unknown> | null | undefined,
  keys: string[]
): boolean | null => {
  if (!source) return null
  for (const key of keys) {
    if (!(key in source)) continue
    const boolValue = toBoolean(source[key])
    if (boolValue !== null) return boolValue
  }
  return null
}

const isFirstTimeFromUser = (user?: StoredAuthUser | null): boolean | null => {
  if (!user) return null

  const firstTimeValue = readBooleanField(user, [
    'is_first_time',
    'first_time',
    'firstTime',
    'new_user',
    'newUser',
  ])
  if (firstTimeValue !== null) return firstTimeValue

  const onboardingCompleted = readBooleanField(user, [
    'has_completed_onboarding',
    'onboarding_completed',
    'is_onboarded',
    'onboarded',
  ])
  if (onboardingCompleted !== null) return !onboardingCompleted

  return null
}

export const getPostLoginRoute = ({
  loginResponse,
  user,
}: PostLoginRouteParams): AppRoute => {
  const userBasedFirstTime = isFirstTimeFromUser(user)
  if (userBasedFirstTime !== null) {
    return userBasedFirstTime ? '/welcome' : '/dashboard'
  }

  if (loginResponse?.new_user) {
    return '/welcome'
  }

  return '/dashboard'
}

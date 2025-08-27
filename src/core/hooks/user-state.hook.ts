import { UserState } from '../models/user.model'
import { logout as logoutUtil } from '../utils/common.util'
import { useAppSelector } from './global-state.hook'

export const useUserState = () => {
  const user = useAppSelector(state => state.authState.user)

  if (!user) {
    return null
  }

  const logout = () => {
    logoutUtil()
  }

  return {
    ...user,
    logout,
  } as UserState
}

import { logout as logoutUtil } from '../config/utils/common.util'
import { IUserState } from '../models/user.model'
import { useAppSelector } from './global-state.hook'

export const useUserState = () => {
  const user = useAppSelector(state => state.auth.user)

  if (!user) {
    return null
  }

  const logout = () => {
    logoutUtil()
  }

  return {
    ...user,
    logout,
  } as IUserState
}

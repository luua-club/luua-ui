export interface IUser {
  email: string
  name: string
  profile_image: string
  deactivated: boolean
  plan: string
}

export interface IUserState extends IUser {
  logout: () => void
}

import { IUser } from './user.model'

export interface ILoginResponse {
  access_token: string
  token_type: string
  user: IUser
}

export interface ILoginRequest {
  token: string
}

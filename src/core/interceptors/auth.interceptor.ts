import { AxiosRequestConfig } from 'axios'

//TODO: WIP
export const authInterceptor = (config: AxiosRequestConfig) => {
  // const token = localStorage.getItem('token')
  // if (token) {
  //   config.headers = {
  //     ...config.headers,
  //     Authorization: `Bearer ${token}`,
  //   }
  // }
  return config
}

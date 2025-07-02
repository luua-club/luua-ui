import { urlType } from './urls.model'

export interface ISidebarItem {
  title: string
  url: urlType
  ping?: 'success' | 'error'
  icon?: React.ReactNode
  onlyOpen?: boolean
  children?: ISidebarItem[]
}

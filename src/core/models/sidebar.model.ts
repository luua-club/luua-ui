import { urlType } from './urls.model'

export interface ISidebarItem {
  title: string
  url: urlType
  icon?: React.ReactNode
  onlyOpen?: boolean
  children?: ISidebarItem[]
}

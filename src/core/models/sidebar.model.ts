import type { LinkProps } from '@tanstack/react-router'

import { urlType } from './urls.model'

export interface ISidebarItem {
  title: string
  url: urlType
  externalUrl?: string
  params?: LinkProps['params']
  search?: LinkProps['search']
  ping?: 'success' | 'error'
  icon?: React.ReactNode
  onlyOpen?: boolean
  children?: ISidebarItem[]
}

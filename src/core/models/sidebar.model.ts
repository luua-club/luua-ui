import type { LinkProps } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'

import { urlType } from './urls.model'

export interface ISidebarItem {
  title: string
  url: urlType
  externalUrl?: string
  params?: LinkProps['params']
  search?: LinkProps['search']
  tooltip?: string
  ping?: 'success' | 'error'
  icon?: LucideIcon
  onlyOpen?: boolean
  children?: ISidebarItem[]
}

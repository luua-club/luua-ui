import type { LinkProps } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'

import { urlType } from './urls.model'

interface SidebarCommonItem {
  title: string
  icon?: LucideIcon
  tooltip?: string
  ping?: 'success' | 'error'
}

export interface SidebarLinkItem extends SidebarCommonItem {
  kind: 'link'
  url: urlType
  externalUrl?: string
  params?: LinkProps['params']
  search?: LinkProps['search']
  onlyOpen?: boolean
}

export interface SidebarActionItem extends SidebarCommonItem {
  kind: 'action'
  url: urlType
  emphasis?: 'low' | 'medium' | 'high'
}

export interface SidebarGroupItem extends SidebarCommonItem {
  kind: 'group'
  children: SidebarLinkItem[]
  activePrefixes?: string[]
  defaultOpen?: boolean
}

export interface SidebarLayoutSection {
  id: string
  items: Array<SidebarActionItem | SidebarLinkItem | SidebarGroupItem>
}

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

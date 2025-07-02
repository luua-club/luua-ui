import { LinkProps } from '@tanstack/react-router'

type urlType = LinkProps['to']

export interface ISidebarItem {
  title: string
  url: urlType
  icon?: React.ReactNode
  onlyOpen?: boolean
  children?: ISidebarItem[]
}

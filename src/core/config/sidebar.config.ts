import {
  Bookmark,
  ChartNoAxesColumn,
  Files,
  Gauge,
  Network,
  Plus,
  Rocket,
} from 'lucide-react'

import {
  SidebarActionItem,
  SidebarGroupItem,
  SidebarLayoutSection,
  SidebarLinkItem,
} from '../models/sidebar.model'

export const workActions: Array<SidebarActionItem | SidebarLinkItem> = [
  {
    kind: 'action',
    title: 'Create Post',
    url: '/creation/create',
    icon: Plus,
    emphasis: 'medium',
  },
]

export const coreLinks: SidebarLinkItem[] = [
  {
    kind: 'link',
    title: 'Dashboard',
    url: '/dashboard',
    icon: Gauge,
  },
  {
    kind: 'link',
    title: 'Analytics',
    url: '/analytics',
    icon: ChartNoAxesColumn,
  },
  {
    kind: 'link',
    title: 'Posts',
    url: '/posts-view',
    icon: Files,
  },
]

export const automationGroup: SidebarGroupItem = {
  kind: 'group',
  title: 'Automation',
  icon: Network,
  activePrefixes: ['/autopilot', '/bookmarks'],
  defaultOpen: true,
  children: [
    {
      kind: 'link',
      title: 'Autopilot',
      url: '/autopilot',
      icon: Rocket,
    },
    {
      kind: 'link',
      title: 'Bookmarks',
      url: '/bookmarks',
      icon: Bookmark,
    },
  ],
}

export const sidebarLayoutSections: SidebarLayoutSection[] = [
  {
    id: 'work-actions',
    items: [...workActions],
  },
  {
    id: 'core-navigation',
    items: [...coreLinks, automationGroup],
  },
]

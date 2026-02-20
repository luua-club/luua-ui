import {
  Bookmark,
  FileCheck,
  Gauge,
  House,
  LucideCalendar,
  Network,
  Paintbrush,
} from 'lucide-react'

import { ISidebarItem } from '../models/sidebar.model'

export const ungroupedItems: ISidebarItem[] = [
  {
    title: 'Welcome',
    url: '/welcome',
    icon: House,
  },
  {
    title: 'Dashboard',
    url: '/creation',
    icon: Gauge,
  },
  {
    title: 'Bookmarks',
    url: '/bookmarks',
    icon: Bookmark,
  },
  {
    title: 'Autopilot',
    url: '/autopilot',
    icon: Network,
  },
  {
    title: 'Styles',
    url: '/preferences',
    icon: Paintbrush,
  },
]

export const postsItems: ISidebarItem[] = [
  {
    title: 'Scheduled',
    url: '/schedule',
    icon: LucideCalendar,
  },
  {
    title: 'Published',
    url: '/published',
    icon: FileCheck,
  },
]

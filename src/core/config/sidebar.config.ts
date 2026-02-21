import {
  Bookmark,
  FileCheck,
  Gauge,
  House,
  LucideCalendar,
  LucideLayoutDashboard,
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
    url: '/dashboard',
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
    title: 'All Posts',
    url: '/posts-view',
    icon: LucideLayoutDashboard,
  },
  {
    title: 'Your Styles',
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

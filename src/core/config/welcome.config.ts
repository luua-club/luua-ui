import {
  Download,
  LucideIcon,
  Network,
  Paintbrush,
  PencilRuler,
} from 'lucide-react'

import { EXTERNAL_URLS } from './constant'

export type BentoItemConfig = {
  title: string
  description: string
  className?: string
  icon: LucideIcon
  route?: string
  externalUrl?: string
}

export const BENTO_ITEMS: BentoItemConfig[] = [
  {
    title: 'Create and schedule social media posts',
    description:
      'Write or AI-generate posts for LinkedIn and X in one place. Publish instantly or schedule ahead to stay consistent and save time.',
    className: 'md:col-span-2',
    icon: PencilRuler,
    route: '/creation/create',
  },
  {
    title: 'Set up styles for AI',
    description:
      "Customize tone and format so Luua's AI writes in your unique voice.",
    className: 'md:col-span-1',
    icon: Paintbrush,
    route: '/preferences',
  },
  {
    title: 'Autopilot content creation',
    description:
      'Creates social media posts from your bookmarks in background.',
    className: 'md:col-span-1',
    icon: Network,
    route: '/auto-gen/inspiration',
  },
  {
    title: 'Download Chrome Extension',
    description:
      'Integrates with X and LinkedIn to let you bookmark or reimagine posts instantly. Reimagine or save content from any website or a YouTube video.',
    className: 'md:col-span-2',
    icon: Download,
    externalUrl: EXTERNAL_URLS.chromeExt,
  },
]

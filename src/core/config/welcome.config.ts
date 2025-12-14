import {
  Download,
  LucideIcon,
  Network,
  Paintbrush,
  PencilRuler,
} from 'lucide-react'

import autopilotPreviewLight from '@/assets/images/autopilot.webp'
import autopilotPreviewDark from '@/assets/images/autopilot-dark.webp'
import bookmarkPreviewLight from '@/assets/images/bookmark.webp'
import bookmarkPreviewDark from '@/assets/images/bookmark-dark.webp'
import createPostPreviewLight from '@/assets/images/create.webp'
import createPostPreviewDark from '@/assets/images/create-dark.webp'
import stylesPreviewLight from '@/assets/images/styles.webp'
import stylesPreviewDark from '@/assets/images/styles-dark.webp'

import { EXTERNAL_URLS } from './constant'

export type BentoImageData = {
  src?: string
  srcDark?: string
  ratio?: 'aspect-[3/2]' | 'aspect-square'
  objectFit?: 'object-top-left' | 'object-top'
}

export type BentoItemConfig = {
  title: string
  description: string
  className?: string
  icon: LucideIcon
  route?: string
  imageData?: BentoImageData
  externalUrl?: string
}

export const BENTO_ITEMS: BentoItemConfig[] = [
  {
    title: 'Download Chrome Extension',
    description:
      'Integrates with X and LinkedIn to let you bookmark or reimagine posts instantly. Reimagine or save content from any website or a YouTube video.',
    className: 'md:col-span-2',
    icon: Download,
    imageData: {
      src: bookmarkPreviewLight,
      srcDark: bookmarkPreviewDark,
      ratio: 'aspect-[3/2]',
      objectFit: 'object-top',
    },
    externalUrl: EXTERNAL_URLS.chromeExt,
  },
  {
    title: 'Autopilot content creation',
    description:
      'Creates social media posts from your bookmarks in background.',
    className: 'md:col-span-1',
    icon: Network,
    imageData: {
      src: autopilotPreviewLight,
      srcDark: autopilotPreviewDark,
      ratio: 'aspect-square',
      objectFit: 'object-top-left',
    },
    route: '/autopilot',
  },
  {
    title: 'Set up styles for AI',
    description:
      "Customize tone and format so Luua's AI writes in your unique voice.",
    className: 'md:col-span-1',
    icon: Paintbrush,
    imageData: {
      src: stylesPreviewLight,
      srcDark: stylesPreviewDark,
      ratio: 'aspect-square',
      objectFit: 'object-top-left',
    },
    route: '/preferences',
  },
  {
    title: 'Create and schedule social media posts',
    description:
      'Write or AI-generate posts for LinkedIn and X in one place. Publish instantly or schedule ahead to stay consistent and save time.',
    className: 'md:col-span-2',
    icon: PencilRuler,
    route: '/creation/create',
    imageData: {
      src: createPostPreviewLight,
      srcDark: createPostPreviewDark,
      ratio: 'aspect-[3/2]',
      objectFit: 'object-top-left',
    },
  },
]

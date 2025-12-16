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
    title: 'Add extension to Chrome',
    description:
      'Capture ideas, repurpose tweets, and save inspiration without ever leaving your current tab.',
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
      'Turn your saved bookmarks into fresh drafts automatically!',
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
    title: 'Create and schedule',
    description:
      'Your focused writing studio. Polish your drafts, add media, and schedule to X & LinkedIn in one flow.',
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

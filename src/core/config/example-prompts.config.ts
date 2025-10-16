import { Brain } from 'lucide-react'

import BrandLinkedIn from '@/assets/images/brand-linkedin.svg?react'
import BrandX from '@/assets/images/brand-x.svg?react'
import BrandYoutube from '@/assets/images/brand-youtube.svg?react'

import { ExamplePrompt } from '../models/example-prompt.model'

const standardPrompts: ExamplePrompt[] = [
  {
    id: 1,
    title: 'Insights and Opinions',
    prompt:
      'Write a post sharing my insights and opinions on the Netflix tech blog https://netflixtechblog.com/building-a-resilient-data-platform-with-write-ahead-log-at-netflix-127b6712359a',
    iconData: {
      icon: Brain,
      className: 'text-yellow-500',
    },
    search: true,
  },
]

const linkedinPrompts: ExamplePrompt[] = [
  {
    id: 1,
    title: 'Boost for LinkedIn',
    prompt:
      'Write a post based on this LinkedIn post in my style, skipping the promotional part - https://www.linkedin.com/posts/bytebytego_systemdesign-coding-interviewtips-activity-7331537920832512001-Gq-v/',
    iconData: {
      icon: BrandLinkedIn,
      className: 'text-blue-500',
    },
    social: 'LinkedIn',
  },
]

const twitterPrompts: ExamplePrompt[] = [
  {
    id: 1,
    title: 'Short Message for X',
    prompt:
      'Craft a short message to Elon asking if I can be part of the 100,000. https://x.com/elonmusk/status/1978475722273620121',
    iconData: {
      icon: BrandX,
    },
    social: 'Twitter',
  },
]

const youtubePrompts: ExamplePrompt[] = [
  {
    id: 1,
    title: 'Summarize YT Video',
    prompt:
      'Can you craft me a crisp brief summary of this Andrew Huberman video ? https://youtu.be/dQw4ww.youtube.com/watch?v=WDv4AWk0J3U',
    iconData: {
      icon: BrandYoutube,
      className: 'text-red-500',
    },
  },
]

export { linkedinPrompts, standardPrompts, twitterPrompts, youtubePrompts }

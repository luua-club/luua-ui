import { Brain } from 'lucide-react'

import BrandLinkedIn from '@/assets/icons/brand-linkedin.svg?react'
import BrandX from '@/assets/icons/brand-x.svg?react'
import BrandYoutube from '@/assets/icons/brand-youtube.svg?react'

import { ExamplePrompt } from '../models/example-prompt.model'

const standardPrompts: ExamplePrompt = {
  title: 'General Query',
  prompt: [
    'Write a post sharing my insights and opinions on the Netflix tech blog https://netflixtechblog.com/building-a-resilient-data-platform-with-write-ahead-log-at-netflix-127b6712359a',
    'Write a post on how using AI for writing posts on social media platforms like LinkedIn and Twitter is a good idea',
    'Post summarizing the key points from this Google Blog, on how the AI will shape the future of work https: https://blog.google/products/google-cloud/ai-trends-business-2025/',
    'Write a post discussing how upcoming AR/VR glasses might revolutionize social media experiences.',
  ],
  iconData: {
    icon: Brain,
    className: 'text-green-500',
  },
}

const linkedinPrompts: ExamplePrompt = {
  title: 'From LinkedIn',
  prompt: [
    'Write a post inspired by this LinkedIn post, skipping any promotional content — https://www.linkedin.com/posts/bytebytego_systemdesign-coding-interviewtips-activity-7331537920832512001-Gq-v/',
    'Write a post inspired by this LinkedIn post, omitting the promotional section — https://www.linkedin.com/posts/vsadhwani_7-cloud-migration-strategies-every-cloud-activity-7348010231622242304-63w8',
  ],
  iconData: {
    icon: BrandLinkedIn,
    className: 'text-blue-500',
  },
}

const twitterPrompts: ExamplePrompt = {
  title: 'From Twitter / X',
  prompt: [
    'Write a congratulatory post about this SpaceX update on the Starship flight test — https://x.com/SpaceX/status/1977925739979612203',
    'Summarize the key insight from this tweet by Sam Altman on the pace of AI progress — https://x.com/pascal_bornet/status/1970518812660506720',
    'Break down the main message from this Lex Fridman tweet quoting Garry Kasparov — https://x.com/lexfridman/status/974624143441350658',
  ],
  iconData: {
    icon: BrandX,
  },
}

const youtubePrompts: ExamplePrompt = {
  title: 'Extract from Youtube',
  prompt: [
    'Use this Andrew Huberman video to craft a compelling post with key takeaways and personal insights: https://youtu.be/WDv4AWk0J3U',
    'Watch this NASA highlights video of the SpaceX Crew-3 mission and write a post capturing the main insights and their significance: https://www.youtube.com/watch?v=UJQIMO7Lso0',
    'Create a post based on the key ideas from this Rails World 2025 keynote by David Heinemeier Hansson: https://www.youtube.com/watch?v=7z0ZrDdQ-6M',
    'Use this video on the top 17 new technology trends for 2026 to write an insightful post highlighting the most impactful trends: https://youtu.be/Otim2mDjsYM',
  ],
  iconData: {
    icon: BrandYoutube,
    className: 'text-red-500',
  },
}

export { linkedinPrompts, standardPrompts, twitterPrompts, youtubePrompts }

import commentsPeep from '@/assets/images/comments-peep.svg'
import likesPeep from '@/assets/images/likes-peep.svg'
import repostPeep from '@/assets/images/repost-peep.svg'
import sharePeep from '@/assets/images/share-peep.svg'
import {
  AnalyticsChannel,
  AnalyticsMetricKey,
} from '@/core/models/analytics.model'

export type SocialMetricConfig = {
  title: string
  metric: AnalyticsMetricKey
  channels: AnalyticsChannel[]
  imageSrc: string
  imageClassName?: string
}

export const metricConfigs: SocialMetricConfig[] = [
  {
    title: 'Likes',
    metric: 'likes',
    channels: ['Twitter', 'LinkedIn'],
    imageSrc: likesPeep,
    imageClassName: 'right-[-10px] h-[146px]',
  },
  {
    title: 'Comments',
    metric: 'comments',
    channels: ['Twitter', 'LinkedIn'],
    imageSrc: commentsPeep,
    imageClassName: 'right-[-4px] h-[142px] scale-x-[-1]',
  },
  {
    title: 'Reposts',
    metric: 'reposts',
    channels: ['Twitter'],
    imageSrc: repostPeep,
    imageClassName: 'right-[-16px] h-[150px]',
  },
  {
    title: 'Shares',
    metric: 'reposts',
    channels: ['Twitter'],
    imageSrc: sharePeep,
    imageClassName: 'right-[-6px] h-[144px] scale-x-[-1]',
  },
]

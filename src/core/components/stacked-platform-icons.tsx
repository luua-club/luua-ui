import { SOCIAL_PLATFORM } from '../config/constant'
import { channelType } from '../models/social.model'

function StackedPlatformIcons({ channels }: { channels: channelType[] }) {
  const platforms = channels
    .map(ch => SOCIAL_PLATFORM.find(s => s.name === ch))
    .filter(Boolean) as (typeof SOCIAL_PLATFORM)[number][]

  return (
    <div className="flex shrink-0 items-center">
      {platforms.map((platform, i) => {
        const Logo = platform.logo
        return (
          <span
            key={platform.name}
            className="bg-card flex items-center justify-center rounded-full border border-dashed"
            style={{ width: 26, height: 26, marginLeft: i === 0 ? 0 : -10 }}
            title={platform.label}
          >
            <Logo width={14} height={14} />
          </span>
        )
      })}
    </div>
  )
}

export default StackedPlatformIcons

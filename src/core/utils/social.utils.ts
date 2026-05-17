import { SOCIAL_PLATFORM } from '@/core/config/constant'
import { type ConnectedChannels } from '@/core/models/org.model'
import { type channelType } from '@/core/models/social.model'

/**
 * Checks if a specific social platform is connected for a project.
 *
 * @param name - The name of the social platform (e.g., 'LinkedIn', 'Twitter')
 * @param channels - The connected channels object from project details
 * @returns True if the platform is connected, false otherwise
 */
const isSocialConnected = (
  name: string,
  channels: ConnectedChannels | null | undefined
) => {
  if (!channels) return false
  if (name === 'LinkedIn') {
    return Boolean(
      channels.linkedin?.connected && channels.linkedin?.meta?.account_type
    )
  }
  if (name === 'Twitter') return channels.twitter?.connected
  if (name === 'Instagram') {
    return Boolean(
      channels.instagram?.connected &&
        channels.instagram?.meta?.selected_instagram_account_id
    )
  }
  return false
}

/**
 * Return the product-facing platform label from the shared social platform
 * config, keeping labels consistent across badges, tooltips, and analytics.
 */
const getSocialPlatformLabel = (name: string) => {
  return SOCIAL_PLATFORM.find(platform => platform.name === name)?.label ?? name
}

/**
 * Return the chart color for a platform from the shared social config.
 * Keep chart usage centralized so light and dark mode stay consistent.
 */
const getSocialPlatformChartColor = (
  name: channelType,
  mode: 'light' | 'dark'
) => {
  return (
    SOCIAL_PLATFORM.find(platform => platform.name === name)?.colors.chart[
      mode
    ] ?? 'currentColor'
  )
}

export {
  getSocialPlatformChartColor,
  getSocialPlatformLabel,
  isSocialConnected,
}

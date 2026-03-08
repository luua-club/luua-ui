import { ConnectedChannels } from '@/core/models/org.model'

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
  if (name === 'Bluesky') return channels.bluesky?.connected
  return false
}

export { isSocialConnected }

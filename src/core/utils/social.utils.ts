import { SOCIAL_PLATFORM } from '@/core/config/constant'
import { UserState } from '@/core/models/user.model'

/**
 * Checks if a specific social platform is connected for a user.
 *
 * @param name - The name of the social platform (e.g., 'LinkedIn', 'Twitter')
 * @param user - The user object containing connection status
 * @returns True if the platform is connected, false otherwise
 */
const isSocialConnected = (name: string, user: UserState) => {
  if (name === 'LinkedIn') return user?.connected_channels?.linkedin?.connected
  if (name === 'Twitter') return user?.connected_channels?.twitter?.connected
  return false
}

/**
 * Checks if more than one social platform is connected for a user.
 *
 * @param user - The user object containing connection status
 * @returns True if more than one platform is connected, false otherwise
 */
const isMoreThanOneSocialIsConnected = (user: UserState) => {
  const connectedPlatforms = SOCIAL_PLATFORM.filter(sp =>
    isSocialConnected(sp.name, user)
  )

  return connectedPlatforms.length > 1
}

/**
 * Checks if any social platform is connected for a user.
 *
 * @param user - The user object containing connection status
 * @returns True if any social platform is connected, false otherwise
 */
const isAnySocialConnected = (user: UserState) => {
  return (
    isSocialConnected('LinkedIn', user) || isSocialConnected('Twitter', user)
  )
}

/**
 * Checks if all socials are connected for a user by their plan.
 *
 * @param user - The user object containing connection status
 * @returns True if all socials are connected, false otherwise
 */
const areAllSocialsConnectedByPlan = (user: UserState) => {
  if (user.plan === 'Free') {
    return isSocialConnected('LinkedIn', user)
  }

  return (
    isSocialConnected('LinkedIn', user) && isSocialConnected('Twitter', user)
  )
}

export {
  areAllSocialsConnectedByPlan,
  isAnySocialConnected,
  isMoreThanOneSocialIsConnected,
  isSocialConnected,
}

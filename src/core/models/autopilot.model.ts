import { channelType } from './social.model'

export interface AutopilotSettings {
  enabled: boolean
  auto_publish: boolean
  base_prompt: string
  frequency_days: number
  channels: channelType[]
  user_timezone: string
}

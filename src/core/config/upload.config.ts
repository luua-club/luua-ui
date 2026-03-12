import { UploadConfig } from '../components/post-card/post-card-actions'
import { channelType } from '../models/social.model'

/**
 * Upload configuration for each social media platform
 */
export const UPLOAD_CONFIGS: Record<channelType, UploadConfig> = {
  LinkedIn: {
    maxFiles: 20,
    maxSizePerFile: 5 * 1024 * 1024, // 5MB
  },
  Twitter: {
    maxFiles: 4,
    maxSizePerFile: 5 * 1024 * 1024, // 5MB
  },
  Instagram: {
    maxFiles: 10,
    maxSizePerFile: 8 * 1024 * 1024, // 8MB
  },
}

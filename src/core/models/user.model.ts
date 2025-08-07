import z from 'zod'

import { toneStyles, writingStyles } from '../config/user-preferences'
import { IUserConnectedChannel } from './social.model'

export interface IUser {
  email: string
  name: string
  profile_image: string
  deactivated: boolean
  connected_channels: {
    linkedin: IUserConnectedChannel
    twitter: IUserConnectedChannel
  }
}

export interface IUserState extends IUser {
  logout: () => void
}

export enum UserStyleStatus {
  INITIAL = 'initial',
  IN_PROGRESS = 'in_progress',
  GENERATED = 'generated',
  FAILED = 'failed',
}

export const UserStyleResponseSchema = z.object({
  source_length: z.number(),
  source_count: z.number(),
  style_gen_state: z.enum(UserStyleStatus).default(UserStyleStatus.INITIAL),
  writing_style: z
    .array(z.string())
    .transform(arr =>
      arr
        .map(val => writingStyles.find(style => style.title === val)?.title)
        .filter(v => v !== undefined)
    )
    .nullish(),
  tone: z
    .array(z.string())
    .transform(arr =>
      arr
        .map(val => toneStyles.find(style => style.title === val)?.title)
        .filter(v => v !== undefined)
    )
    .nullish(),
  style_tags: z.array(z.string()).nullish(),
})
export type userStyleResponseType = z.infer<typeof UserStyleResponseSchema>

export interface IUserAdvancedStyleRequest {
  style_text?: string
  gcp_storage_doc_ids?: string[]
}

export interface IUserStyleRequest {
  writing_style?: string[]
  tone?: string[]
}

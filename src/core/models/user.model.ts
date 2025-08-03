import z from 'zod'

import { toneStyles, writingStyles } from '../config/user-preferences'

export interface IUser {
  email: string
  name: string
  profile_image: string
  deactivated: boolean
}

export interface IUserState extends IUser {
  logout: () => void
}

export enum UserStyleStatus {
  INITIAL = 1,
  IN_PROGRESS = 2,
  GENERATED = 3,
}

export const UserStyleResponseSchema = z.object({
  source_length: z.number(),
  source_count: z.number(),
  style_gen_state: z.number().default(UserStyleStatus.INITIAL),
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

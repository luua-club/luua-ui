import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { channelType } from '../models/social.model'

interface PromptState {
  prompt: string | null
  search: boolean
  channel: channelType | null
}

const initialState: PromptState = {
  prompt: null,
  search: false,
  channel: null,
}

/**
 * A Slice that holds data for generate post api.
 * Used for transferring data between pages.
 */
const promptSlice = createSlice({
  name: 'prompt',
  initialState,
  reducers: {
    setPrompt: (state, action: PayloadAction<PromptState>) => {
      state.prompt = action.payload.prompt
      state.search = action.payload.search
      state.channel = action.payload.channel
    },
    clearPrompt: state => {
      state.prompt = null
      state.search = false
      state.channel = null
    },
  },
})

export const { setPrompt, clearPrompt } = promptSlice.actions
export default promptSlice.reducer

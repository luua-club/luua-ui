import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IPromptState {
  prompt: string | null
}

const initialState: IPromptState = {
  prompt: null,
}

const promptSlice = createSlice({
  name: 'prompt',
  initialState,
  reducers: {
    setPrompt: (state, action: PayloadAction<string>) => {
      state.prompt = action.payload
    },
    clearPrompt: state => {
      state.prompt = null
    },
  },
})

export const { setPrompt, clearPrompt } = promptSlice.actions
export default promptSlice.reducer

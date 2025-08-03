import { configureStore } from '@reduxjs/toolkit'

import authReducer from '@/core/store/auth-slice'
import promptReducer from '@/core/store/prompt-slice'

export const store = configureStore({
  reducer: {
    authState: authReducer,
    promptState: promptReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

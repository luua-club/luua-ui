import { configureStore } from '@reduxjs/toolkit'

import authReducer from '@/core/store/auth-slice'
import navbarReducer from '@/core/store/navbar-slice'
import postsViewReducer from '@/core/store/posts-view-slice'
import promptReducer from '@/core/store/prompt-slice'

export const store = configureStore({
  reducer: {
    authState: authReducer,
    promptState: promptReducer,
    navbarState: navbarReducer,
    postsViewState: postsViewReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

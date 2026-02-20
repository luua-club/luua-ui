import { configureStore } from '@reduxjs/toolkit'

import authReducer from '@/core/store/auth-slice'
import creationTabsReducer from '@/core/store/creation-tabs-slice'
import navbarReducer from '@/core/store/navbar-slice'
import postsViewReducer from '@/core/store/posts-view-slice'
import promptReducer from '@/core/store/prompt-slice'

export const store = configureStore({
  reducer: {
    authState: authReducer,
    promptState: promptReducer,
    navbarState: navbarReducer,
    postsViewState: postsViewReducer,
    creationTabsState: creationTabsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

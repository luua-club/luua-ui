import { configureStore } from '@reduxjs/toolkit'

import authReducer from '@/core/store/auth-slice'
import navbarReducer from '@/core/store/navbar-slice'
import orgReducer from '@/core/store/org-slice'
import postsViewReducer from '@/core/store/posts-view-slice'

export const store = configureStore({
  reducer: {
    authState: authReducer,
    orgState: orgReducer,
    navbarState: navbarReducer,
    postsViewState: postsViewReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

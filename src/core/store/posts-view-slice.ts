import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { type postStatusType } from '@/core/models/post.model'

interface IPostsViewState {
  statusFilter: postStatusType | 'all'
}

const initialState: IPostsViewState = {
  statusFilter: 'all',
}

const postsViewSlice = createSlice({
  name: 'postsView',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<postStatusType | 'all'>) => {
      state.statusFilter = action.payload
    },
    clearStatusFilter: state => {
      state.statusFilter = 'all'
    },
  },
})

export const { setStatusFilter, clearStatusFilter } = postsViewSlice.actions
export default postsViewSlice.reducer

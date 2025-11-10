import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ReactNode } from 'react'

interface INavbarState {
  rightSideComponent: ReactNode | null
}

const initialState: INavbarState = {
  rightSideComponent: null,
}

const navbarSlice = createSlice({
  name: 'navbar',
  initialState,
  reducers: {
    setNavbarRightComponent: (state, action: PayloadAction<ReactNode>) => {
      state.rightSideComponent = action.payload
    },
    clearNavbarRightComponent: state => {
      state.rightSideComponent = null
    },
  },
})

export const { setNavbarRightComponent, clearNavbarRightComponent } =
  navbarSlice.actions

export default navbarSlice.reducer

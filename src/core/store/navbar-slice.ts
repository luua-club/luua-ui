import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type NavbarRightComponentKey = 'welcome' | null

interface INavbarState {
  rightSideComponentKey: NavbarRightComponentKey
}

const initialState: INavbarState = {
  rightSideComponentKey: null,
}

const navbarSlice = createSlice({
  name: 'navbar',
  initialState,
  reducers: {
    setNavbarRightComponent: (
      state,
      action: PayloadAction<NavbarRightComponentKey>
    ) => {
      state.rightSideComponentKey = action.payload
    },
    clearNavbarRightComponent: state => {
      state.rightSideComponentKey = null
    },
  },
})

export const { setNavbarRightComponent, clearNavbarRightComponent } =
  navbarSlice.actions

export default navbarSlice.reducer

import { createSlice } from '@reduxjs/toolkit'

interface INavbarState {
  rightSideComponentKey: null
}

const initialState: INavbarState = {
  rightSideComponentKey: null,
}

const navbarSlice = createSlice({
  name: 'navbar',
  initialState,
  reducers: {},
})

export default navbarSlice.reducer

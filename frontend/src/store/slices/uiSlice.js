import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebarCollapsed(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarMobileOpen(state, action) {
      state.sidebarMobileOpen = action.payload;
    },
  },
});

export const { toggleSidebarCollapsed, setSidebarMobileOpen } = uiSlice.actions;
export default uiSlice.reducer;

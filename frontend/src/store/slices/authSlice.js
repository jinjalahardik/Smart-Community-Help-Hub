import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  orgStatus: null,
  isAuthenticated: false,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart(state) {
      state.status = 'loading';
      state.error = null;
    },
    authSucceeded(state, action) {
      state.status = 'succeeded';
      state.user = action.payload.user;
      state.orgStatus = action.payload.orgStatus ?? null;
      state.isAuthenticated = true;
      state.error = null;
    },
    authFailed(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    authLoggedOut(state) {
      state.user = null;
      state.orgStatus = null;
      state.isAuthenticated = false;
      state.status = 'idle';
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { authStart, authSucceeded, authFailed, authLoggedOut, updateUser } = authSlice.actions;
export default authSlice.reducer;

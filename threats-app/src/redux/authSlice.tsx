import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

// Типы состояния
interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  is_staff: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  username: null,
  is_staff: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ username: string; is_staff: boolean }>) => {
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.is_staff = action.payload.is_staff;

      
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = null;
      state.is_staff = false;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;

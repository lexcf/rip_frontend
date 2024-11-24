import { configureStore } from '@reduxjs/toolkit';
import threatsReducer from './threatsSlice';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    threats: threatsReducer,
    auth: authReducer,
  },
});

export default store;

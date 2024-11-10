// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import threatsReducer from './threatsSlice';

const store = configureStore({
  reducer: {
    threats: threatsReducer,
  },
});

export default store;

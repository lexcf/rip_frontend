import { configureStore } from '@reduxjs/toolkit';
import threatsReducer from './threatsSlice';
import authReducer from './authSlice';
import requestsReducer from './requestsSlice'

const store = configureStore({
  reducer: {
    threats: threatsReducer,
    auth: authReducer,
    requests: requestsReducer,
  },
});

export default store;

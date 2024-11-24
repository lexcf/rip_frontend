import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

// Типы состояния
interface RequestsState {
  threats_amount: number;
  pk: number | null;
}

const initialState: RequestsState = {
  threats_amount: 0,
  pk: null
};

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    setThreatsAmount: (state, action) => {
      state.threats_amount = action.payload; 
    },
    setRequestPk: (state, action) => {
      state.pk = action.payload;
    }
  },
});

export const { setThreatsAmount, setRequestPk } = requestsSlice.actions;

export default requestsSlice.reducer;

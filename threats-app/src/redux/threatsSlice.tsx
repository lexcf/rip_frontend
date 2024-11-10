// src/redux/threatsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  inputValue: '',
  priceFrom: '',
  priceTo: '',
  threats: [],
  filteredThreats: [],
  currentRequestId: null,
  currentCount: 0,
};

const threatsSlice = createSlice({
  name: 'threats',
  initialState,
  reducers: {
    setThreats: (state, action) => {
      state.threats = action.payload;
      state.filteredThreats = action.payload;
    },
    setFilteredThreats: (state, action) => {
      state.filteredThreats = action.payload;
    },
    setInputValue: (state, action) => {
      state.inputValue = action.payload;
    },
    setPriceFrom: (state, action) => {
      state.priceFrom = action.payload;
    },
    setPriceTo: (state, action) => {
      state.priceTo = action.payload;
    },
    setCurrentRequestId: (state, action) => {
      state.currentRequestId = action.payload;
    },
    setCurrentCount: (state, action) => {
      state.currentCount = action.payload;
    },
  },
});

export const {
  setThreats,
  setFilteredThreats,
  setInputValue,
  setPriceFrom,
  setPriceTo,
  setCurrentRequestId,
  setCurrentCount,
} = threatsSlice.actions;

export default threatsSlice.reducer;

// src/redux/threatsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  inputValue: '',
  priceFrom: '',
  priceTo: '',
  threats: [],
  filteredThreats: [],
  currentRequestId: null,
  currentCount: 0,
  loading: false,
  error: null,
};

// Thunk for fetching threats
export const fetchThreats = createAsyncThunk(
  'threats/fetchThreats',
  async (filters, { rejectWithValue }) => {
    try {
      const { inputValue, priceFrom, priceTo } = filters || {};
      const params = {};

      if (inputValue) params.name = inputValue;
      if (priceFrom) params.price_from = priceFrom;
      if (priceTo) params.price_to = priceTo;

      const response = await axios.get('/api/threats/', { params });

      const threatsData = response.data.filter((item) => item.pk !== undefined);

      return threatsData;
    } catch (error) {
      return rejectWithValue('Ошибка при загрузке угроз');
    }
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreats.fulfilled, (state, action) => {
        state.loading = false;
        state.threats = action.payload;
        state.filteredThreats = action.payload;
      })
      .addCase(fetchThreats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
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

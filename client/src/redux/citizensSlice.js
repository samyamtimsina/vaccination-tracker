import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios.js';

//Async thunk to fetch citizens list
export const fetchCitizens = createAsyncThunk(
  'citizens/fetchCitizens',
  async () => {
    const response = await axios.get('/citizens');
    return response.data;
  },
);

//Async thunk to add a citizen
export const addCitizen = createAsyncThunk(
  'citizens/addCitizen',
  async (citizenData) => {
    const response = await axios.post('/citizens', citizenData);
    return response.data;
  },
);

const citizensSlice = createSlice({
  name: 'citizens',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCitizens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCitizens.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCitizens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addCitizen.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCitizen.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(addCitizen.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default citizensSlice.reducer;

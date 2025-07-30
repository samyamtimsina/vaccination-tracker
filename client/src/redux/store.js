import { configureStore } from '@reduxjs/toolkit';
import citizenReducer from './citizensSlice.js';

export const store = configureStore({
  reducer: {
    citizens: citizenReducer,
  },
});

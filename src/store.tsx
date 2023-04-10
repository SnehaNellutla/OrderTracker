import { configureStore } from '@reduxjs/toolkit';
import draftReducer from './draftSlice';

export type RootState = ReturnType<typeof store.getState>;
const store = configureStore({
  reducer: {
    draft: draftReducer,
  },
});

export default store;
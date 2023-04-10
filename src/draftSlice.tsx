import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from './types';

interface DraftState {
  content: any;
  isCreating: boolean;
}

const initialState: DraftState = {
  content: null,
  isCreating: false,
};

const draftSlice = createSlice({
  name: 'draft',
  initialState,
  reducers: {
    setContent: (state, action: PayloadAction<Order>) => {
      state.content = action.payload;
    },
    setIsCreating: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload;
    },
  },
});

console.log("DraftSlice",draftSlice);
export const { setContent, setIsCreating } = draftSlice.actions;

export default draftSlice.reducer;

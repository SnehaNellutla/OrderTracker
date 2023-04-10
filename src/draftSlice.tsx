import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DraftState {
  content: string;
  isCreating: boolean;
}

const initialState: DraftState = {
  content: '',
  isCreating: false,
};

const draftSlice = createSlice({
  name: 'draft',
  initialState,
  reducers: {
    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
    },
    setIsCreating: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload;
    },
  },
});

export const { setContent, setIsCreating } = draftSlice.actions;

export default draftSlice.reducer;

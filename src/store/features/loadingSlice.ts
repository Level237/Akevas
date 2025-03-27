import { createSlice } from '@reduxjs/toolkit';

interface LoadingState {
  isInitialLoading: boolean;
}

const initialState: LoadingState = {
  isInitialLoading: true,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setInitialLoading: (state, action) => {
      state.isInitialLoading = action.payload;
    },
  },
});

export const { setInitialLoading } = loadingSlice.actions;
export default loadingSlice; 
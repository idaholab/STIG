import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../types/types.ts';

const initialState: AppState = {
  openDrawerLeft: false,
  openDrawerLeftWidth: 64,
};

const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    toggleDrawer: (state) => {
      state.openDrawerLeft = !state.openDrawerLeft;
    },
    setDrawerLeftWidth: (state, action: PayloadAction<number>) => {
      state.openDrawerLeftWidth = action.payload;
    },
  },
});

export const store = configureStore({
  reducer: {
    appState: appStateSlice.reducer,
  },
});

export const appStateActions = appStateSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

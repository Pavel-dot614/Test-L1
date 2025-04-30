import { configureStore } from '@reduxjs/toolkit';
import newsSlice from './newsSlice';
import userSlice from './userSlice';
import authSlice from './authSlice';

const store = configureStore({
  reducer: {
    news: newsSlice.reducer,
    user: userSlice.reducer,
    auth: authSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

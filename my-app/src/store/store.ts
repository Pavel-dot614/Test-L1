import { configureStore } from '@reduxjs/toolkit';
import newsReducer from './newsSlice';
import userReducer from './userSlice';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    news: newsReducer,
    user: userReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import authSlice from '../store/authSlice';
import newsSlice from '../store/newsSlice';
import userSlice from '../store/userSlice';
import { ReactElement, ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

export function renderWithProvider(
  ui: ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        newsReducer: newsSlice.reducer,
        authReducer: authSlice.reducer,
        userReducer: userSlice.reducer,
      },
      preloadedState,
    }),
    ...renderOptions
  } = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter>{children}</MemoryRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

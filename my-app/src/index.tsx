import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import store from '../src/store/store';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);

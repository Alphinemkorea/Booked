import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './library/store.js';
import App from './App.jsx';
import { ErrorBoundary } from './components/layout/ErrorBoundary.jsx';
import './styles/global.css';

try {
  const theme = store.getState()?.ui?.theme || 'light';
  document.documentElement.setAttribute('data-theme', theme);
} catch (e) {
  console.warn(e);
}

const el = document.getElementById('root');
if (!el) {
  document.body.innerHTML = '<p style="padding:24px">Missing #root</p>';
} else {
  ReactDOM.createRoot(el).render(
    <React.StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <App />
        </Provider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

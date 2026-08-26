import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './library/store.js';
import App from './App.jsx';
import './styles/global.css';

const theme = store.getState().ui.theme;
document.documentElement.setAttribute('data-theme', theme);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

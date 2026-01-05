import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/theme.css';
import { registerServiceWorker } from './serviceWorkerRegistration';

const assetBase = import.meta.env.BASE_URL || '/';
document.documentElement.style.setProperty('--asset-base', assetBase);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

registerServiceWorker();

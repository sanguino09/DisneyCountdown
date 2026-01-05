import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/theme.css';
import { registerServiceWorker } from './serviceWorkerRegistration';
import { withBase } from './utils/assetBase';

document.documentElement.style.setProperty(
  '--background-image-desktop',
  `url("${withBase('background-castle.jpg')}")`
);
document.documentElement.style.setProperty(
  '--background-image-mobile',
  `url("${withBase('background-castle-vertical.jpg')}")`
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

registerServiceWorker();

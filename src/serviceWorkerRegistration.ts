import { withBase } from './utils/assetBase';

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const serviceWorkerUrl = withBase('service-worker.js');
      navigator.serviceWorker
        .register(serviceWorkerUrl)
        .catch((error) => console.error('SW registration failed', error));
    });
  }
}

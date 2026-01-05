const eventDate = new Date('2025-02-25T09:30:00+01:00');
let countdownInterval;
let deferredPrompt;

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const notifyButton = document.getElementById('notifyButton');
const installButton = document.getElementById('installButton');
const toast = document.getElementById('toast');

function updateCountdown() {
  const now = new Date();
  const diff = eventDate - now;

  if (diff <= 0) {
    clearInterval(countdownInterval);
    daysEl.textContent = '0';
    hoursEl.textContent = '0';
    minutesEl.textContent = '0';
    secondsEl.textContent = '0';
    showToast('¡Ya estamos en Disneyland París! 🎉');
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  daysEl.textContent = String(days);
  hoursEl.textContent = String(hours).padStart(2, '0');
  minutesEl.textContent = String(minutes).padStart(2, '0');
  secondsEl.textContent = String(seconds).padStart(2, '0');
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    showToast('Las notificaciones no son compatibles en este navegador.');
    return;
  }

  let permission = Notification.permission;
  if (permission === 'default') {
    permission = await Notification.requestPermission();
  }

  if (permission !== 'granted') {
    showToast('Activa las notificaciones para tus recordatorios mágicos.');
    return;
  }

  triggerMagicNotification();
}

function triggerMagicNotification() {
  const body = `Ya falta poco: ${formatCountdown()} para nuestra aventura ✨`;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification('Cuenta regresiva Disney', {
        body,
        icon: 'icons/icon-192.png',
        badge: 'icons/icon-192.png',
        vibrate: [80, 30, 80],
        tag: 'disney-countdown',
        actions: [
          { action: 'share', title: 'Compartir' },
          { action: 'close', title: 'Cerrar' }
        ]
      });
    });
  } else {
    new Notification('Cuenta regresiva Disney', { body });
  }

  showToast('Notificación enviada con la cuenta regresiva.');
}

function formatCountdown() {
  const now = new Date();
  const diff = eventDate - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return `${days} días y ${hours} horas`;
}

function initServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => {
      showToast('No pudimos activar el modo offline, intenta de nuevo.');
    });
  });
}

function setupInstallPrompt() {
  if (!installButton) return;

  installButton.style.display = 'none';

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    installButton.style.display = 'inline-flex';
  });

  installButton.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      showToast('¡App instalada! Ahora la magia está en tu pantalla.');
    }
    deferredPrompt = null;
  });
}

function initParticles() {
  const starfield = document.querySelector('.starfield');
  if (!starfield) return;

  const extra = document.createElement('div');
  extra.className = 'starfield extra';
  extra.style.backgroundImage = 'radial-gradient(1px 1px at 50% 10%, rgba(255,255,255,0.6), transparent), radial-gradient(2px 2px at 10% 60%, rgba(255,255,255,0.7), transparent), radial-gradient(1px 1px at 90% 80%, rgba(255,255,255,0.55), transparent)';
  extra.style.animationDuration = '14s';
  document.body.appendChild(extra);
}

function initSharing() {
  if (!('share' in navigator)) return;
  const shareLink = document.createElement('button');
  shareLink.className = 'button button--ghost';
  shareLink.textContent = 'Compartir esta emoción';
  shareLink.setAttribute('aria-label', 'Compartir la cuenta regresiva');
  document.querySelector('.cta-row')?.appendChild(shareLink);

  shareLink.addEventListener('click', async () => {
    const text = `Nos vamos a Disneyland París el 25 de febrero a las 09:30. Quedan ${formatCountdown()} ✨`;
    try {
      await navigator.share({ title: 'Cuenta regresiva Disney', text, url: location.href });
      showToast('¡Compartido! Más magia para todos.');
    } catch (err) {
      if (err && err.name !== 'AbortError') {
        showToast('No se pudo compartir, pero la emoción sigue aquí.');
      }
    }
  });
}

function setupNotificationButton() {
  if (!notifyButton) return;
  notifyButton.addEventListener('click', requestNotificationPermission);
}

function startCountdown() {
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}

initServiceWorker();
setupInstallPrompt();
setupNotificationButton();
initParticles();
initSharing();
startCountdown();

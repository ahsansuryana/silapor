import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerServiceWorker } from './lib/register-sw'
import { requestFcmToken, registerFcmToken, listenForForegroundMessages } from './lib/fcm'
import { initPwaInstall } from './lib/pwa'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

initPwaInstall();

function initFcm() {
  const token = localStorage.getItem('access_token');
  if (!token) return;

  registerServiceWorker().then(() => {
    requestFcmToken().then((fcmToken) => {
      if (fcmToken) {
        registerFcmToken(fcmToken);
      }
    });
    listenForForegroundMessages();
  });
}

initFcm();

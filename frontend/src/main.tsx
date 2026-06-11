import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { requestFcmToken, registerFcmToken, listenForForegroundMessages } from './lib/fcm'
import { initPwaInstall } from './lib/pwa'
import { initSW } from './lib/sw-register'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

initPwaInstall();
initSW();

function initFcm() {
  const token = localStorage.getItem('access_token');
  if (!token) return;

  requestFcmToken().then((fcmToken) => {
    if (fcmToken) registerFcmToken(fcmToken);
  });
  listenForForegroundMessages();
}

initFcm();

importScripts('https://www.gstatic.com/firebasejs/11.6.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAi7SZJlx2Az3_HD4NPCRlndmYSPqLq_vw',
  authDomain: 'si-laporan-kerusakan.firebaseapp.com',
  projectId: 'si-laporan-kerusakan',
  storageBucket: 'si-laporan-kerusakan.firebasestorage.app',
  messagingSenderId: '686107677786',
  appId: '1:686107677786:web:7ed604af98d1e12086f463',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || 'SILAPOR', {
    body: body || '',
    icon: '/LOGO_SILAPOR.png',
    badge: '/LOGO_SILAPOR.png',
    data: { url: payload.data?.url || '/notifications' },
  });
});

import admin from 'firebase-admin';

function getServiceAccount() {
  const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (path) {
    return require(path);
  }

  return {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  };
}

if (!admin.apps.length) {
  const serviceAccount = getServiceAccount();
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const messaging = admin.messaging();
export default admin;

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const swPath = resolve(__dirname, '..', 'public', 'firebase-messaging-sw.js');
const envPath = resolve(__dirname, '..', '.env');

function loadEnv() {
  try {
    const content = readFileSync(envPath, 'utf-8');
    const env = {};
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      env[key] = val;
    }
    return env;
  } catch {
    return process.env;
  }
}

const env = loadEnv();

let swContent = readFileSync(swPath, 'utf-8');

swContent = swContent
  .replace('___FIREBASE_API_KEY___', env.VITE_FIREBASE_API_KEY || '')
  .replace('___FIREBASE_AUTH_DOMAIN___', env.VITE_FIREBASE_AUTH_DOMAIN || '')
  .replace('___FIREBASE_PROJECT_ID___', env.VITE_FIREBASE_PROJECT_ID || '')
  .replace('___FIREBASE_STORAGE_BUCKET___', env.VITE_FIREBASE_STORAGE_BUCKET || '')
  .replace('___FIREBASE_MESSAGING_SENDER_ID___', env.VITE_FIREBASE_MESSAGING_SENDER_ID || '')
  .replace('___FIREBASE_APP_ID___', env.VITE_FIREBASE_APP_ID || '');

writeFileSync(swPath, swContent);
console.log('[SW] firebase-messaging-sw.js generated');

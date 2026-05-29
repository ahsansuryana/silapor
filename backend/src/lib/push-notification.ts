import { messaging } from './firebase-admin';
import { FcmTokensModel } from '../models/fcm_tokens.model';

export async function sendPush(
  userId: string,
  title: string,
  body: string,
  url = '/notifications',
) {
  try {
    const tokens = await FcmTokensModel.findByUserId(userId);
    if (!tokens.length) return;

    const messages = tokens.map((t) => ({
      token: t.token,
      notification: { title, body },
      webpush: {
        fcmOptions: { link: url } as any,
      },
    }));

    const responses = await messaging.sendEach(messages);

    for (let i = 0; i < responses.responses.length; i++) {
      const resp = responses.responses[i];
      if (!resp.success) {
        const errCode = resp.error?.code;
        if (
          errCode === 'messaging/invalid-registration-token' ||
          errCode === 'messaging/registration-token-not-registered'
        ) {
          await FcmTokensModel.deleteByToken(tokens[i].token);
        }
      }
    }
  } catch (err) {
    console.error('[PUSH] Failed to send:', err);
  }
}

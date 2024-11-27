import { initializeApp, cert} from 'firebase-admin/app';

const initializeFirebaseAdmin = () => {
  initializeApp({
    credential: cert("./service-account.json"),
  });
  console.log('Firebase Admin initialized');
}

export default defineNitroPlugin((_) => {
    initializeFirebaseAdmin();
})

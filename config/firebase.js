import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Verificar si ya existe una instancia de Firebase
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    });
    console.log('Firebase Admin inicializado correctamente');
  } catch (error) {
    console.error('Error al inicializar Firebase Admin:', error);
  }
}

export const db = admin.firestore();
export default admin; 
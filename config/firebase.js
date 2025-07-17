// --- Configuración de Firebase Admin SDK ---
// Inicializa la app de Firebase usando variables de entorno

import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Inicializa Firebase solo si no hay instancias previas
if (!admin.apps || !admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') // Corrige saltos de línea
      })
    });
    console.log('Firebase Admin inicializado correctamente');
  } catch (error) {
    console.error('Error al inicializar Firebase Admin:', error);
  }
}

// Exporta la instancia de Firestore para usar en el proyecto
export const db = admin.firestore();
export default admin; 
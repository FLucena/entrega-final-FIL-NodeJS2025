// --- Modelo de Usuario ---
// Maneja toda la interacción con la base de datos (Firestore y archivos JSON)

import fs from 'fs';
import path from 'path';
import { db } from '../config/firebase.js';

const dataPath = path.join(path.dirname(new URL(import.meta.url).pathname), '../data/mockUsers.json');

// --- Funciones para archivos JSON ---

function readUsersFromFile() {
  if (!fs.existsSync(dataPath)) return [];
  const data = fs.readFileSync(dataPath);
  return JSON.parse(data);
}

function writeUsersToFile(users) {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
}

// --- Funciones para Firestore ---

async function getAllFromFirestore() {
  try {
    const usersSnapshot = await db.collection('users').get();
    if (usersSnapshot.empty) {
      return [];
    }
    return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error al obtener usuarios de Firestore:', error);
    throw error;
  }
}

async function getByIdFromFirestore(id) {
  try {
    const userDoc = await db.collection('users').doc(id).get();
    if (!userDoc.exists) return null;
    return { id: userDoc.id, ...userDoc.data() };
  } catch (error) {
    console.error('Error al obtener usuario de Firestore:', error);
    throw error;
  }
}

async function getByEmailFromFirestore(email) {
  try {
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    if (userSnapshot.empty) return null;
    const userDoc = userSnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
  } catch (error) {
    console.error('Error al obtener usuario por email de Firestore:', error);
    throw error;
  }
}

async function createInFirestore(user) {
  try {
    const userRef = await db.collection('users').add(user);
    return { id: userRef.id, ...user };
  } catch (error) {
    console.error('Error al crear usuario en Firestore:', error);
    throw error;
  }
}

async function updateInFirestore(id, updatedUser) {
  try {
    const userRef = db.collection('users').doc(id);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return null;
    
    await userRef.update(updatedUser);
    const updatedDoc = await userRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  } catch (error) {
    console.error('Error al actualizar usuario en Firestore:', error);
    throw error;
  }
}

async function deleteFromFirestore(id) {
  try {
    const userRef = db.collection('users').doc(id);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return false;
    
    await userRef.delete();
    return true;
  } catch (error) {
    console.error('Error al eliminar usuario de Firestore:', error);
    throw error;
  }
}

// --- API pública del modelo ---

// Devuelve todos los usuarios
export async function getAll() {
  if (process.env.NODE_ENV === 'development') {
    return readUsersFromFile();
  }
  
  try {
    return await getAllFromFirestore();
  } catch (error) {
    // Fallback a archivo JSON si Firestore falla
    console.log('Fallback a datos locales debido a error en Firestore');
    return readUsersFromFile();
  }
}

// Devuelve un usuario por ID
export async function getById(id) {
  if (process.env.NODE_ENV === 'development') {
    return readUsersFromFile().find(u => u.id === id);
  }
  
  try {
    return await getByIdFromFirestore(id);
  } catch (error) {
    // Fallback a archivo JSON si Firestore falla
    console.log('Fallback a datos locales debido a error en Firestore');
    return readUsersFromFile().find(u => u.id === id);
  }
}

// Devuelve un usuario por email
export async function getByEmail(email) {
  if (process.env.NODE_ENV === 'development') {
    return readUsersFromFile().find(u => u.email === email);
  }
  
  try {
    return await getByEmailFromFirestore(email);
  } catch (error) {
    // Fallback a archivo JSON si Firestore falla
    console.log('Fallback a datos locales debido a error en Firestore');
    return readUsersFromFile().find(u => u.email === email);
  }
}

// Crea un nuevo usuario
export async function create(user) {
  if (process.env.NODE_ENV === 'development') {
    const users = readUsersFromFile();
    const newUser = {
      ...user,
      id: (users.length + 1).toString(),
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    writeUsersToFile(users);
    return newUser;
  }
  
  try {
    const userWithTimestamp = {
      ...user,
      createdAt: new Date()
    };
    return await createInFirestore(userWithTimestamp);
  } catch (error) {
    // Fallback a archivo JSON si Firestore falla
    console.log('Fallback a datos locales debido a error en Firestore');
    const users = readUsersFromFile();
    const newUser = {
      ...user,
      id: (users.length + 1).toString(),
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    writeUsersToFile(users);
    return newUser;
  }
}

// Actualiza un usuario existente por ID
export async function update(id, updatedUser) {
  if (process.env.NODE_ENV === 'development') {
    const users = readUsersFromFile();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    
    const updated = {
      ...users[idx],
      ...updatedUser,
      updatedAt: new Date().toISOString()
    };
    users[idx] = updated;
    writeUsersToFile(users);
    return updated;
  }
  
  try {
    const userWithTimestamp = {
      ...updatedUser,
      updatedAt: new Date()
    };
    return await updateInFirestore(id, userWithTimestamp);
  } catch (error) {
    // Fallback a archivo JSON si Firestore falla
    console.log('Fallback a datos locales debido a error en Firestore');
    const users = readUsersFromFile();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    
    const updated = {
      ...users[idx],
      ...updatedUser,
      updatedAt: new Date().toISOString()
    };
    users[idx] = updated;
    writeUsersToFile(users);
    return updated;
  }
}

// Elimina un usuario por ID
export async function remove(id) {
  if (process.env.NODE_ENV === 'development') {
    let users = readUsersFromFile();
    const initialLength = users.length;
    users = users.filter(u => u.id !== id);
    writeUsersToFile(users);
    return users.length < initialLength;
  }
  
  try {
    return await deleteFromFirestore(id);
  } catch (error) {
    // Fallback a archivo JSON si Firestore falla
    console.log('Fallback a datos locales debido a error en Firestore');
    let users = readUsersFromFile();
    const initialLength = users.length;
    users = users.filter(u => u.id !== id);
    writeUsersToFile(users);
    return users.length < initialLength;
  }
} 
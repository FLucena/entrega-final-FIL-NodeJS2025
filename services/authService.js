// --- Servicio de autenticación ---
import { db } from '../config/firebase.js';
import bcrypt from 'bcryptjs';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { isValidEmail, isValidPassword } from '../utils/validation.js';
import { generateToken } from '../utils/jwt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function loadMockUsers() {
  try {
    const mockDataPath = join(__dirname, '..', 'data', 'mockUsers.json');
    const mockData = await readFile(mockDataPath, 'utf-8');
    return JSON.parse(mockData);
  } catch (error) {
    return [];
  }
}

async function userExistsByEmail(email, users) {
  return users.find(u => u.email === email);
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function registerUser({ email, password, name }) {
  if (!email || !password || !name) {
    throw { status: 400, error: 'Campos requeridos faltantes', message: 'Todos los campos (email, password, name) son requeridos' };
  }
  if (!isValidEmail(email)) {
    throw { status: 400, error: 'Formato de email inválido', message: 'El email debe tener un formato válido (ejemplo@dominio.com)' };
  }
  if (!isValidPassword(password)) {
    throw { status: 400, error: 'Contraseña inválida', message: 'La contraseña debe tener al menos 6 caracteres' };
  }
  if (process.env.NODE_ENV === 'development') {
    const mockUsers = await loadMockUsers();
    if (await userExistsByEmail(email, mockUsers)) {
      throw { status: 400, error: 'Usuario ya existe', message: 'Ya existe un usuario registrado con este email' };
    }
    const hashedPassword = await hashPassword(password);
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      email,
      password: hashedPassword,
      name,
      createdAt: new Date().toISOString()
    };
    const token = generateToken({ id: newUser.id, email });
    return { token, user: { id: newUser.id, email, name }, message: 'Usuario registrado correctamente' };
  }
  try {
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    if (!userSnapshot.empty) {
      throw { status: 400, error: 'Usuario ya existe', message: 'Ya existe un usuario registrado con este email' };
    }
    const hashedPassword = await hashPassword(password);
    const userRef = await db.collection('users').add({
      email,
      password: hashedPassword,
      name,
      createdAt: new Date()
    });
    const token = generateToken({ id: userRef.id, email });
    return { token, user: { id: userRef.id, email, name }, message: 'Usuario registrado correctamente' };
  } catch (dbError) {
    // Fallback a mock
    const mockUsers = await loadMockUsers();
    if (await userExistsByEmail(email, mockUsers)) {
      throw { status: 400, error: 'Usuario ya existe', message: 'Ya existe un usuario registrado con este email' };
    }
    const hashedPassword = await hashPassword(password);
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      email,
      password: hashedPassword,
      name,
      createdAt: new Date().toISOString()
    };
    const token = generateToken({ id: newUser.id, email });
    return { token, user: { id: newUser.id, email, name }, message: 'Usuario registrado usando datos de respaldo' };
  }
}

export async function loginUser({ email, password }) {
  if (!email || !password) {
    throw { status: 400, error: 'Campos requeridos faltantes', message: 'Email y contraseña son requeridos' };
  }
  if (process.env.NODE_ENV === 'development') {
    const mockUsers = await loadMockUsers();
    const user = await userExistsByEmail(email, mockUsers);
    if (!user) {
      throw { status: 401, error: 'Credenciales inválidas', message: 'Email o contraseña incorrectos' };
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw { status: 401, error: 'Credenciales inválidas', message: 'Email o contraseña incorrectos' };
    }
    const token = generateToken({ id: user.id, email: user.email });
    return { token, user: { id: user.id, email: user.email, name: user.name }, message: 'Inicio de sesión exitoso' };
  }
  try {
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    if (userSnapshot.empty) {
      throw { status: 401, error: 'Credenciales inválidas', message: 'Email o contraseña incorrectos' };
    }
    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    const isValid = await bcrypt.compare(password, userData.password);
    if (!isValid) {
      throw { status: 401, error: 'Credenciales inválidas', message: 'Email o contraseña incorrectos' };
    }
    const token = generateToken({ id: userDoc.id, email });
    return { token, user: { id: userDoc.id, email: userData.email, name: userData.name }, message: 'Inicio de sesión exitoso' };
  } catch (dbError) {
    // Fallback a mock
    const mockUsers = await loadMockUsers();
    const user = await userExistsByEmail(email, mockUsers);
    if (!user) {
      throw { status: 401, error: 'Credenciales inválidas', message: 'Email o contraseña incorrectos' };
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw { status: 401, error: 'Credenciales inválidas', message: 'Email o contraseña incorrectos' };
    }
    const token = generateToken({ id: user.id, email: user.email });
    return { token, user: { id: user.id, email: user.email, name: user.name }, message: 'Inicio de sesión exitoso usando datos de respaldo' };
  }
} 
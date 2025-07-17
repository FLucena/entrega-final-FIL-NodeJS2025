import { db } from '../config/firebase.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { registerUser, loginUser } from '../services/authService.js';

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

// --- Funciones auxiliares para validación y utilidades ---
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

async function userExistsByEmail(email, users) {
  return users.find(u => u.email === email);
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '24h' });
}

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const result = await registerUser({ email, password, name });
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.error || 'Error al registrar usuario', message: error.message || 'Ocurrió un error al intentar registrar el usuario' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.error || 'Error al iniciar sesión', message: error.message || 'Ocurrió un error al intentar iniciar sesión' });
  }
}; 
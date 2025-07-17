// --- Servicio de autenticación ---
// Contiene la lógica de negocio y usa el modelo para acceder a los datos

import * as UserModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { isValidEmail, isValidPassword } from '../utils/validation.js';
import { generateToken } from '../utils/jwt.js';

// Función auxiliar para verificar si un usuario existe por email
async function userExistsByEmail(email) {
  const user = await UserModel.getByEmail(email);
  return user;
}

// Función auxiliar para hashear contraseñas
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function registerUser({ email, password, name }) {
  // Validaciones de entrada
  if (!email || !password || !name) {
    throw { status: 400, error: 'Campos requeridos faltantes', message: 'Email, contraseña y nombre son requeridos' };
  }

  if (!isValidEmail(email)) {
    throw { status: 400, error: 'Email inválido', message: 'El formato del email no es válido' };
  }

  if (!isValidPassword(password)) {
    throw { status: 400, error: 'Contraseña inválida', message: 'La contraseña debe tener al menos 6 caracteres' };
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await userExistsByEmail(email);
    if (existingUser) {
      throw { status: 400, error: 'Usuario ya existe', message: 'Ya existe un usuario registrado con este email' };
    }

    // Hashear la contraseña
    const hashedPassword = await hashPassword(password);

    // Crear el usuario usando el modelo
    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      name
    });

    // Generar token JWT
    const token = generateToken({ id: newUser.id, email });

    return { 
      token, 
      user: { id: newUser.id, email, name }, 
      message: 'Usuario registrado correctamente' 
    };
  } catch (error) {
    if (error.status) throw error; // Re-lanzar errores de negocio
    console.error('Error en servicio al registrar usuario:', error);
    throw { status: 500, error: 'Error interno del servidor', message: 'No se pudo registrar el usuario' };
  }
}

export async function loginUser({ email, password }) {
  // Validaciones de entrada
  if (!email || !password) {
    throw { status: 400, error: 'Campos requeridos faltantes', message: 'Email y contraseña son requeridos' };
  }

  if (!isValidEmail(email)) {
    throw { status: 400, error: 'Email inválido', message: 'El formato del email no es válido' };
  }

  try {
    // Buscar usuario por email usando el modelo
    const user = await userExistsByEmail(email);
    if (!user) {
      throw { status: 401, error: 'Credenciales inválidas', message: 'Email o contraseña incorrectos' };
    }

    // Verificar contraseña
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw { status: 401, error: 'Credenciales inválidas', message: 'Email o contraseña incorrectos' };
    }

    // Generar token JWT
    const token = generateToken({ id: user.id, email });

    return { 
      token, 
      user: { id: user.id, email: user.email, name: user.name }, 
      message: 'Inicio de sesión exitoso' 
    };
  } catch (error) {
    if (error.status) throw error; // Re-lanzar errores de negocio
    console.error('Error en servicio al hacer login:', error);
    throw { status: 500, error: 'Error interno del servidor', message: 'No se pudo procesar el inicio de sesión' };
  }
} 
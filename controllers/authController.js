import { db } from '../config/firebase.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.URL);
const __dirname = dirname(__filename);

// Función para cargar datos mock de usuarios
async function loadMockUsers() {
  try {
    const mockDataPath = join(__dirname, '..', 'data', 'mockUsers.json');
    const mockData = await readFile(mockDataPath, 'utf-8');
    return JSON.parse(mockData);
  } catch (error) {
    console.error('Error loading mock users:', error);
    return [];
  }
}

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Campos requeridos faltantes',
        message: 'Todos los campos (email, password, name) son requeridos'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Formato de email inválido',
        message: 'El email debe tener un formato válido (ejemplo@dominio.com)'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Contraseña inválida',
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // En desarrollo, usar datos mock
    if (process.env.NODE_ENV === 'development') {
      const mockUsers = await loadMockUsers();
      const existingUser = mockUsers.find(u => u.email === email);
      
      if (existingUser) {
        return res.status(400).json({ 
          error: 'Usuario ya existe',
          message: 'Ya existe un usuario registrado con este email'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = {
        id: (mockUsers.length + 1).toString(),
        email,
        password: hashedPassword,
        name,
        createdAt: new Date().toISOString()
      };

      const token = jwt.sign(
        { id: newUser.id, email },
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '24h' }
      );

      return res.status(201).json({
        message: 'Usuario registrado correctamente',
        token,
        user: {
          id: newUser.id,
          email,
          name
        }
      });
    }

    try {
      // Verificar si el usuario ya existe
      const userSnapshot = await db.collection('users')
        .where('email', '==', email)
        .get();

      if (!userSnapshot.empty) {
        return res.status(400).json({ 
          error: 'Usuario ya existe',
          message: 'Ya existe un usuario registrado con este email'
        });
      }

      // Hash de la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Crear nuevo usuario
      const userRef = await db.collection('users').add({
        email,
        password: hashedPassword,
        name,
        createdAt: new Date()
      });

      // Generar token
      const token = jwt.sign(
        { id: userRef.id, email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'Usuario registrado correctamente',
        token,
        user: {
          id: userRef.id,
          email,
          name
        }
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // En caso de error en producción, intentar usar datos mock como fallback
      try {
        const mockUsers = await loadMockUsers();
        const existingUser = mockUsers.find(u => u.email === email);
        
        if (existingUser) {
          return res.status(400).json({ 
            error: 'Usuario ya existe',
            message: 'Ya existe un usuario registrado con este email'
          });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = {
          id: (mockUsers.length + 1).toString(),
          email,
          password: hashedPassword,
          name,
          createdAt: new Date().toISOString()
        };

        const token = jwt.sign(
          { id: newUser.id, email },
          process.env.JWT_SECRET || 'dev-secret',
          { expiresIn: '24h' }
        );

        return res.status(201).json({
          message: 'Usuario registrado usando datos de respaldo',
          token,
          user: {
            id: newUser.id,
            email,
            name
          }
        });
      } catch (mockError) {
        throw new Error('Error al registrar usuario y fallback falló');
      }
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Error al registrar usuario',
      message: 'Ocurrió un error al intentar registrar el usuario'
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Campos requeridos faltantes',
        message: 'Email y contraseña son requeridos'
      });
    }

    // En desarrollo, usar datos mock
    if (process.env.NODE_ENV === 'development') {
      const mockUsers = await loadMockUsers();
      const user = mockUsers.find(u => u.email === email);
      
      if (!user) {
        return res.status(401).json({ 
          error: 'Credenciales inválidas',
          message: 'Email o contraseña incorrectos'
        });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ 
          error: 'Credenciales inválidas',
          message: 'Email o contraseña incorrectos'
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '24h' }
      );

      return res.json({
        message: 'Inicio de sesión exitoso',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    }

    try {
      // Buscar usuario
      const userSnapshot = await db.collection('users')
        .where('email', '==', email)
        .get();

      if (userSnapshot.empty) {
        return res.status(401).json({ 
          error: 'Credenciales inválidas',
          message: 'Email o contraseña incorrectos'
        });
      }

      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();

      // Verificar contraseña
      const validPassword = await bcrypt.compare(password, userData.password);
      if (!validPassword) {
        return res.status(401).json({ 
          error: 'Credenciales inválidas',
          message: 'Email o contraseña incorrectos'
        });
      }

      // Generar token
      const token = jwt.sign(
        { id: userDoc.id, email: userData.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Inicio de sesión exitoso',
        token,
        user: {
          id: userDoc.id,
          email: userData.email,
          name: userData.name
        }
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // En caso de error en producción, intentar usar datos mock como fallback
      try {
        const mockUsers = await loadMockUsers();
        const user = mockUsers.find(u => u.email === email);
        
        if (!user) {
          return res.status(401).json({ 
            error: 'Credenciales inválidas',
            message: 'Email o contraseña incorrectos'
          });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return res.status(401).json({ 
            error: 'Credenciales inválidas',
            message: 'Email o contraseña incorrectos'
          });
        }

        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET || 'dev-secret',
          { expiresIn: '24h' }
        );

        return res.json({
          message: 'Inicio de sesión exitoso usando datos de respaldo',
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name
          }
        });
      } catch (mockError) {
        throw new Error('Error al iniciar sesión y fallback falló');
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Error al iniciar sesión',
      message: 'Ocurrió un error al intentar iniciar sesión'
    });
  }
}; 
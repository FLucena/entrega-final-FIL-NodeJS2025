import { db } from '../config/firebase.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Formato de email inválido' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    try {
      // Verificar si el usuario ya existe
      const userSnapshot = await db.collection('users')
        .where('email', '==', email)
        .get();

      if (!userSnapshot.empty) {
        return res.status(400).json({ error: 'El usuario ya existe' });
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
        token,
        user: {
          id: userRef.id,
          email,
          name
        }
      });
    } catch (dbError) {
      // Handle Firebase initialization errors
      if (dbError.code === 'app/no-app') {
        return res.status(500).json({ error: 'Error de configuración del servidor' });
      }
      throw dbError; // Re-throw other database errors
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const userSnapshot = await db.collection('users')
      .where('email', '==', email)
      .get();

    if (userSnapshot.empty) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, userData.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign(
      { id: userDoc.id, email: userData.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: userDoc.id,
        email: userData.email,
        name: userData.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 
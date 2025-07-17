// --- Middleware de autenticación JWT ---
// Verifica la validez del token JWT en la cabecera Authorization

import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // Extrae el token del header Authorization: 'Bearer <token>'
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    // Verifica y decodifica el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adjunta el usuario decodificado al request
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
}; 
// --- Utilidades para JWT ---
import jwt from 'jsonwebtoken';

export function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '24h' });
} 
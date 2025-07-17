// --- Rutas de autenticación ---
// Define los endpoints para registro e inicio de sesión de usuarios

import { Router } from 'express';
import { register, login } from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

export default router; 
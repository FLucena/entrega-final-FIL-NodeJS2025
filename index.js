import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import './config/firebase.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import corsOptions from './config/cors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 peticiones por ventana
  message: 'Demasiadas peticiones desde esta IP, por favor intente más tarde',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Configuración de rate limiter específico para autenticación
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // límite de 5 intentos por hora
  message: 'Demasiados intentos de inicio de sesión, por favor intente más tarde',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware de seguridad
app.use(helmet());

// Configuración CORS
app.use(cors(corsOptions));

app.use(express.json());

// Aplicar rate limiter general a todas las rutas
app.use(limiter);

// Rutas
app.use('/api/productos', productRoutes);
// Aplicar rate limiter específico a las rutas de autenticación
app.use('/api/auth', authLimiter, authRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'API funcionando',
    endpoints: [
      '/api/productos',
      '/api/auth'
    ]
  });
});

// Manejador de errores global mejorado
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  res.status(statusCode).json({ 
    error: message,
    status: statusCode,
    timestamp: new Date().toISOString()
  });
});

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

// Para Vercel
export default app;

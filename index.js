import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { db } from './config/firebase.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import corsOptions from './config/cors.js';

const __filename = fileURLToPath(import.meta.URL);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar trust proxy para Vercel
app.set('trust proxy', 1);

// Configuración de rate limiter
const limiter = rateLimit({
  windowMs: process.env.NODE_ENV === 'test' ? 1 : 15 * 60 * 1000, // 1ms for tests, 15 minutes for production
  max: process.env.NODE_ENV === 'test' ? 1000 : 100, // 1000 requests for tests, 100 for production
  message: 'Demasiadas solicitudes desde esta IP, por favor intente más tarde',
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true
});

// Configuración de rate limiter específico para autenticación
const authLimiter = rateLimit({
  windowMs: process.env.NODE_ENV === 'test' ? 1 : 60 * 60 * 1000, // 1ms for tests, 1 hour for production
  max: process.env.NODE_ENV === 'test' ? 1000 : 5, // 1000 requests for tests, 5 for production
  message: 'Demasiados intentos de inicio de sesión, por favor intente más tarde',
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true
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
app.use('/api/auth', authLimiter, authRoutes);

// Ruta de health check para Vercel
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

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
  console.error('Error:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  res.status(statusCode).json({ 
    error: message,
    status: statusCode,
    timestamp: new Date().toISOString()
  });
});

// Iniciar el servidor solo si no estamos en producción o en modo test
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
    });
  });
}

// Exportar la app para Vercel y testing
export { app };
export default app;

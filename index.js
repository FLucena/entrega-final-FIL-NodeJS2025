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

const __filename = fileURLToPath(import.meta.url);
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
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      scriptSrcAttr: ["'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Configuración CORS
app.use(cors(corsOptions));

app.use(express.json());

// Servir archivos estáticos desde la carpeta public
app.use(express.static(join(__dirname, 'public')));

// Aplicar rate limiter general a todas las rutas
app.use(limiter);

// Rutas de la API
app.use('/api/products', productRoutes);
app.use('/api/auth', authLimiter, authRoutes);

// Ruta de health check para Vercel
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Ruta principal - servir el frontend
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Ruta para cualquier otra ruta - servir el frontend (SPA)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
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

  // Manejo de señales para cierre limpio
  const gracefulShutdown = async () => {
    console.log('Cerrando servidor...');
    
    // Cerrar el servidor HTTP
    server.close(() => {
      console.log('Servidor HTTP cerrado');
      process.exit(0);
    });

    // Si después de 10 segundos no se cierra, forzar el cierre
    setTimeout(() => {
      console.error('No se pudo cerrar el servidor a tiempo, forzando cierre...');
      process.exit(1);
    }, 10000);
  };

  // Manejar señales de terminación
  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);

  // Manejar errores no capturados
  process.on('uncaughtException', (err) => {
    console.error('Error no capturado:', err);
    gracefulShutdown();
  });

  process.on('unhandledRejection', (err) => {
    console.error('Promesa rechazada no manejada:', err);
    gracefulShutdown();
  });
}

// Exportar la app para Vercel y testing
export { app };
export default app;

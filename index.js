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
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: process.env.NODE_ENV === 'test' ? 1 : 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 1000 : 100,
  message: 'Demasiadas solicitudes desde esta IP, por favor intente más tarde',
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true
});

const authLimiter = rateLimit({
  windowMs: process.env.NODE_ENV === 'test' ? 1 : 60 * 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 1000 : 5,
  message: 'Demasiados intentos de inicio de sesión, por favor intente más tarde',
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true
});

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

app.use(cors(corsOptions));

app.use(express.json());

app.use(limiter);

app.use('/api/products', productRoutes);
app.use('/api/auth', authLimiter, authRoutes);



app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

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

const startServer = async (initialPort) => {
  const findAvailablePort = async (startPort) => {
    const net = await import('net');
    
    return new Promise((resolve, reject) => {
      const server = net.createServer();
      
      server.listen(startPort, () => {
        const { port } = server.address();
        server.close(() => resolve(port));
      });
      
      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          resolve(findAvailablePort(startPort + 1));
        } else {
          reject(err);
        }
      });
    });
  };

  try {
    const availablePort = await findAvailablePort(Number(initialPort));
    const server = createServer(app);
    
    server.listen(availablePort, () => {
      console.log(`🚀 Servidor iniciado exitosamente en http://localhost:${availablePort}`);
    });

    const gracefulShutdown = async (signal) => {
      console.log(`\n🛑 Recibida señal ${signal}, cerrando servidor...`);
      
      server.close(() => {
        console.log('✅ Servidor HTTP cerrado correctamente');
        process.exit(0);
      });

      setTimeout(() => {
        console.error('⏰ No se pudo cerrar el servidor a tiempo, forzando cierre...');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));
    process.on('uncaughtException', (err) => {
      console.error('❌ Error no capturado:', err);
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Promesa rechazada no manejada:', reason);
      gracefulShutdown('unhandledRejection');
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Puerto ${availablePort} está en uso`);
        process.exit(1);
      } else {
        console.error('❌ Error del servidor:', err);
        gracefulShutdown('server_error');
      }
    });

    return server;
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer(PORT).catch((error) => {
    console.error('❌ Error fatal al iniciar el servidor:', error);
    process.exit(1);
  });
}

export { app };
export default app;

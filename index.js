import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import exampleRoutes from './routes/exampleRoutes.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import './config/firebase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/api', exampleRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'API funcionando',
    endpoints: [
      '/api',
      '/api/productos',
      '/api/auth'
    ]
  });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

// Para Vercel
export default app;

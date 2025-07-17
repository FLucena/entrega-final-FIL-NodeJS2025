// --- Configuración de CORS ---
// Define los orígenes permitidos y opciones para las solicitudes cross-origin

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'https://proyecto-final-ecommerce-francisco.vercel.app',
  process.env.url,
].filter(Boolean);

const corsOptions = {
  // Valida si el origen de la solicitud está permitido
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 horas
};

export default corsOptions; 
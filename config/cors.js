const allowedOrigins = [
  'http://localhost:3000',     // Desarrollo local
  'http://localhost:5173',     // Vite default port
  'http://127.0.0.1:3000',    // Localhost alternativo
  'http://127.0.0.1:5173',    // Vite alternativo
  'https://proyecto-final-ecommerce-francisco.vercel.app', // Dominio de producción
  process.env.FRONTEND_URL,    // URL del frontend en producción
].filter(Boolean); // Filtra valores undefined/null

const corsOptions = {
  origin: (origin, callback) => {
    // En desarrollo, permitir solicitudes sin origin (como Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Permite cookies y headers de autenticación
  maxAge: 86400, // Cache preflight requests por 24 horas
};

export default corsOptions; 
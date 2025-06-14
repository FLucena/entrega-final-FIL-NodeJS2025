import app from './index.js';

const PORT = process.env.PORT || 3000;

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
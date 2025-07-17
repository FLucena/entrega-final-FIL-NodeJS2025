// --- Helper para manejo de respuestas HTTP ---
// Centraliza el manejo de respuestas y errores para evitar duplicación

export const sendResponse = (res, status, data, message = '') => {
  const response = { data };
  if (message) response.message = message;
  res.status(status).json(response);
};

export const sendSuccess = (res, data, message = '') => {
  sendResponse(res, 200, data, message);
};

export const sendCreated = (res, data, message = '') => {
  sendResponse(res, 201, data, message);
};

export const sendError = (res, error) => {
  const status = error.status || 500;
  const errorMessage = error.error || 'Error interno del servidor';
  const message = error.message || '';
  
  res.status(status).json({ 
    error: errorMessage, 
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

export const sendNotFound = (res, message = 'Recurso no encontrado') => {
  res.status(404).json({ error: 'No encontrado', message });
};

export const sendUnauthorized = (res, message = 'No autorizado') => {
  res.status(401).json({ error: 'No autorizado', message });
};

export const sendBadRequest = (res, message = 'Solicitud incorrecta') => {
  res.status(400).json({ error: 'Solicitud incorrecta', message });
}; 
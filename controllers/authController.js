import { registerUser, loginUser } from '../services/authService.js';

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const result = await registerUser({ email, password, name });
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.error || 'Error al registrar usuario', message: error.message || 'Ocurrió un error al intentar registrar el usuario' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.error || 'Error al iniciar sesión', message: error.message || 'Ocurrió un error al intentar iniciar sesión' });
  }
}; 
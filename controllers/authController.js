import { registerUser, loginUser } from '../services/authService.js';
import { sendCreated, sendSuccess, sendError } from '../utils/responseHandler.js';

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const result = await registerUser({ email, password, name });
    sendCreated(res, result);
  } catch (error) {
    sendError(res, error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    sendSuccess(res, result);
  } catch (error) {
    sendError(res, error);
  }
}; 
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, patchProduct } from '../services/productService.js';
import { sendSuccess, sendCreated, sendError } from '../utils/responseHandler.js';

export const getProductsController = async (req, res) => {
  try {
    const products = await getAllProducts();
    sendSuccess(res, products);
  } catch (error) {
    sendError(res, error);
  }
};

export const getProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    sendSuccess(res, product, 'Producto obtenido correctamente');
  } catch (error) {
    sendError(res, error);
  }
};

export const createProductController = async (req, res) => {
  try {
    const result = await createProduct(req.body);
    sendCreated(res, result);
  } catch (error) {
    sendError(res, error);
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await updateProduct(id, req.body);
    sendSuccess(res, result);
  } catch (error) {
    sendError(res, error);
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteProduct(id);
    sendSuccess(res, result);
  } catch (error) {
    sendError(res, error);
  }
};

export const patchProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await patchProduct(id, req.body);
    sendSuccess(res, result);
  } catch (error) {
    sendError(res, error);
  }
}; 
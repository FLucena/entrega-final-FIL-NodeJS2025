import jwt from 'jsonwebtoken';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, patchProduct } from '../services/productService.js';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

export const getProductsController = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos', message: error.message });
  }
};

export const getProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado', message: `No existe un producto con el ID: ${id}` });
    }
    res.json({ message: 'Producto obtenido correctamente', product });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto', message: error.message });
  }
};

export const createProductController = async (req, res) => {
  try {
    const result = await createProduct(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.error || 'Error al crear el producto', message: error.message });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await updateProduct(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.error || 'Error al actualizar el producto', message: error.message });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteProduct(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.error || 'Error al eliminar el producto', message: error.message });
  }
};

export const patchProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await patchProduct(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.error || 'Error al actualizar el producto', message: error.message });
  }
}; 
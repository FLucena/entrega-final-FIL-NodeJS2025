import { db } from '../config/firebase.js';
import jwt from 'jsonwebtoken';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, patchProduct } from '../services/productService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

async function loadMockData() {
  try {
    const mockDataPath = join(__dirname, '..', 'data', 'mockProducts.json');
    const mockData = await readFile(mockDataPath, 'utf-8');
    const parsedData = JSON.parse(mockData);
    return parsedData.products || [];
  } catch (error) {
    return [];
  }
}

// --- Funciones auxiliares para validación y utilidades ---
function isValidProductFields({ name, description, price, stock }) {
  return name && description && price && stock;
}

function isValidPatchFields(updateData) {
  if (!updateData || Object.keys(updateData).length === 0) return false;
  const allowedFields = ['name', 'description', 'price', 'stock'];
  return Object.keys(updateData).every(field => allowedFields.includes(field));
}

function toNumberIfPresent(obj, fields) {
  const result = { ...obj };
  fields.forEach(field => {
    if (result[field] !== undefined) {
      result[field] = Number(result[field]);
    }
  });
  return result;
}

export const getProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos', message: error.message });
  }
};

export const getProductById = async (req, res) => {
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

export const createProduct = async (req, res) => {
  try {
    const result = await createProduct(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.error || 'Error al crear el producto', message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await updateProduct(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.error || 'Error al actualizar el producto', message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteProduct(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.error || 'Error al eliminar el producto', message: error.message });
  }
};

export const patchProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await patchProduct(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.error || 'Error al actualizar el producto', message: error.message });
  }
}; 
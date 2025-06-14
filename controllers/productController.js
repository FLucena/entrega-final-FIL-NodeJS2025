import { db } from '../config/firebase.js';
import jwt from 'jsonwebtoken';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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

// Función para cargar datos ficticios
const loadMockData = async () => {
  try {
    const mockDataPath = join(__dirname, '..', 'data', 'mockProducts.json');
    const data = await readFile(mockDataPath, 'utf8');
    return JSON.parse(data).products;
  } catch (error) {
    console.error('Error loading mock data:', error);
    return [];
  }
};

export const getProducts = async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      // En desarrollo, usar datos ficticios
      const products = await loadMockData();
      return res.json(products);
    }

    // En producción, usar Firebase
    const productsSnapshot = await db.collection('products').get();
    const products = [];
    productsSnapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    res.json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (process.env.NODE_ENV === 'development') {
      // En desarrollo, buscar en datos ficticios
      const products = await loadMockData();
      const product = products.find(p => p.id === id);
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      return res.json(product);
    }

    // En producción, usar Firebase
    const productDoc = await db.collection('products').doc(id).get();
    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({
      id: productDoc.id,
      ...productDoc.data()
    });
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    if (process.env.NODE_ENV === 'development') {
      // En desarrollo, simular creación
      const products = await loadMockData();
      const newProduct = {
        id: (products.length + 1).toString(),
        name,
        description,
        price,
        stock,
        createdAt: new Date().toISOString()
      };
      return res.status(201).json(newProduct);
    }

    // En producción, usar Firebase
    const productRef = await db.collection('products').add({
      name,
      description,
      price,
      stock,
      createdAt: new Date()
    });

    res.status(201).json({
      id: productRef.id,
      name,
      description,
      price,
      stock
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    if (process.env.NODE_ENV === 'development') {
      // En desarrollo, simular actualización
      const products = await loadMockData();
      const productIndex = products.findIndex(p => p.id === id);
      if (productIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      const updatedProduct = {
        ...products[productIndex],
        name: name || products[productIndex].name,
        description: description || products[productIndex].description,
        price: price || products[productIndex].price,
        stock: stock || products[productIndex].stock
      };
      return res.json(updatedProduct);
    }

    // En producción, usar Firebase
    const productRef = db.collection('products').doc(id);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await productRef.update({
      name: name || productDoc.data().name,
      description: description || productDoc.data().description,
      price: price || productDoc.data().price,
      stock: stock || productDoc.data().stock
    });

    const updatedDoc = await productRef.get();
    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (process.env.NODE_ENV === 'development') {
      // En desarrollo, simular eliminación
      const products = await loadMockData();
      const productIndex = products.findIndex(p => p.id === id);
      if (productIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      return res.json({ message: 'Producto eliminado' });
    }

    // En producción, usar Firebase
    const productRef = db.collection('products').doc(id);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await productRef.delete();
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
}; 
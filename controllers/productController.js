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

// Función para cargar datos mock
async function loadMockData() {
  try {
    const mockDataPath = join(__dirname, '..', 'data', 'mockProducts.json');
    const mockData = await readFile(mockDataPath, 'utf-8');
    return JSON.parse(mockData);
  } catch (error) {
    console.error('Error loading mock data:', error);
    return [];
  }
}

export const getProducts = async (req, res) => {
  try {
    // En desarrollo, usar datos mock
    if (process.env.NODE_ENV === 'development') {
      const mockProducts = await loadMockData();
      return res.json(mockProducts);
    }

    // En producción, usar Firebase
    const productsSnapshot = await db.collection('products').get();
    
    if (productsSnapshot.empty) {
      return res.status(200).json({
        message: 'No hay productos disponibles',
        products: []
      });
    }

    const products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      message: 'Productos obtenidos correctamente',
      products
    });
  } catch (error) {
    console.error('Error getting products:', error);
    // En caso de error en producción, intentar usar datos mock como fallback
    try {
      const mockProducts = await loadMockData();
      return res.json({
        message: 'Usando datos de respaldo',
        products: mockProducts
      });
    } catch (mockError) {
      res.status(500).json({ 
        error: 'Error al obtener los productos',
        message: 'No se pudieron obtener los productos ni cargar los datos de respaldo'
      });
    }
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // En desarrollo, usar datos mock
    if (process.env.NODE_ENV === 'development') {
      const mockProducts = await loadMockData();
      const product = mockProducts.find(p => p.id === id);
      if (!product) {
        return res.status(404).json({ 
          error: 'Producto no encontrado',
          message: `No existe un producto con el ID: ${id}`
        });
      }
      return res.json({
        message: 'Producto obtenido correctamente',
        product
      });
    }

    // En producción, usar Firebase
    const productDoc = await db.collection('products').doc(id).get();
    
    if (!productDoc.exists) {
      return res.status(404).json({ 
        error: 'Producto no encontrado',
        message: `No existe un producto con el ID: ${id}`
      });
    }

    res.json({
      message: 'Producto obtenido correctamente',
      product: {
        id: productDoc.id,
        ...productDoc.data()
      }
    });
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({ 
      error: 'Error al obtener el producto',
      message: 'Ocurrió un error al intentar obtener el producto'
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    // Validar campos requeridos
    if (!name || !description || !price || !stock) {
      return res.status(400).json({ 
        error: 'Campos requeridos faltantes',
        message: 'Todos los campos (name, description, price, stock) son requeridos'
      });
    }

    // En desarrollo, simular creación
    if (process.env.NODE_ENV === 'development') {
      const mockProducts = await loadMockData();
      const newProduct = {
        id: (mockProducts.length + 1).toString(),
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        createdAt: new Date().toISOString()
      };
      return res.status(201).json({
        message: 'Producto creado correctamente',
        product: newProduct
      });
    }

    // En producción, usar Firebase
    const productRef = await db.collection('products').add({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      createdAt: new Date()
    });

    res.status(201).json({
      message: 'Producto creado correctamente',
      product: {
        id: productRef.id,
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        createdAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ 
      error: 'Error al crear el producto',
      message: 'Ocurrió un error al intentar crear el producto'
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    // Validar campos requeridos
    if (!name || !description || !price || !stock) {
      return res.status(400).json({ 
        error: 'Campos requeridos faltantes',
        message: 'Todos los campos (name, description, price, stock) son requeridos'
      });
    }

    // En desarrollo, simular actualización
    if (process.env.NODE_ENV === 'development') {
      const mockProducts = await loadMockData();
      const productIndex = mockProducts.findIndex(p => p.id === id);
      if (productIndex === -1) {
        return res.status(404).json({ 
          error: 'Producto no encontrado',
          message: `No existe un producto con el ID: ${id}`
        });
      }
      const updatedProduct = {
        ...mockProducts[productIndex],
        name,
        description,
        price: Number(price),
        stock: Number(stock)
      };
      return res.json({
        message: 'Producto actualizado correctamente',
        product: updatedProduct
      });
    }

    // En producción, usar Firebase
    const productRef = db.collection('products').doc(id);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).json({ 
        error: 'Producto no encontrado',
        message: `No existe un producto con el ID: ${id}`
      });
    }

    await productRef.update({
      name,
      description,
      price: Number(price),
      stock: Number(stock)
    });

    res.json({
      message: 'Producto actualizado correctamente',
      product: {
        id,
        name,
        description,
        price: Number(price),
        stock: Number(stock)
      }
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ 
      error: 'Error al actualizar el producto',
      message: 'Ocurrió un error al intentar actualizar el producto'
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // En desarrollo, simular eliminación
    if (process.env.NODE_ENV === 'development') {
      const mockProducts = await loadMockData();
      const productIndex = mockProducts.findIndex(p => p.id === id);
      if (productIndex === -1) {
        return res.status(404).json({ 
          error: 'Producto no encontrado',
          message: `No existe un producto con el ID: ${id}`
        });
      }
      return res.json({ 
        message: 'Producto eliminado correctamente',
        id
      });
    }

    // En producción, usar Firebase
    const productRef = db.collection('products').doc(id);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).json({ 
        error: 'Producto no encontrado',
        message: `No existe un producto con el ID: ${id}`
      });
    }

    await productRef.delete();
    res.json({ 
      message: 'Producto eliminado correctamente',
      id
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ 
      error: 'Error al eliminar el producto',
      message: 'Ocurrió un error al intentar eliminar el producto'
    });
  }
}; 